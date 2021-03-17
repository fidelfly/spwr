import React, {
    ReactElement,
    useEffect,
    useState,
    useCallback,
    useImperativeHandle,
    ForwardRefRenderFunction,
    PropsWithChildren,
    CSSProperties,
    useRef,
    MutableRefObject,
} from "react";
import { Button, Image, Upload, UploadProps } from "antd";
import ImgCrop, { ImgCropProps } from "antd-img-crop";
import { RcFile } from "antd/es/upload";
import { Ajax } from "../ajax";
import { UploadRequestOption as RcCustomRequestOptions } from "rc-upload/lib/interface";
import { PlusOutlined } from "@ant-design/icons";

type ImageValueProps<T = unknown> = Pick<
    UploadProps,
    "accept" | "beforeUpload" | "data" | "disabled" | "name" | "className" | "style"
> &
    PropsWithChildren<{
        crop?: ImgCropProps;
        disableAutoUpload?: boolean;
        action: string;
        imgURL: string | ((value: T) => string | null);
        transform?: (key: string) => T;
        preview?: {
            uploadText?: string;
            removeText?: string;
            size?: { width?: number; height?: number };
            style?: CSSProperties;
            className?: string;
        };
        value?: T;
        onChange?: (value: T) => void;
    }>;

export type ImageValueRef<T = unknown> = {
    remove: () => void;
    upload: () => Promise<T | null>;
    getValue: () => T | null;
};

const ImageValueComponent: ForwardRefRenderFunction<ImageValueRef, ImageValueProps> = (props, ref): ReactElement => {
    const {
        crop,
        disableAutoUpload,
        name,
        action,
        beforeUpload,
        data,
        imgURL,
        transform,
        preview,
        /*        modalTitle,
        modalOk,
        modalCancel,*/
        onChange,
        value,
        children,
        ...others
    } = props;
    const [imageFile, setImageFile] = useState<Blob | null>(null);
    const [previewUrl, setPreview] = useState<string | null>(null);
    const [imageObj, setImageObj] = useState<unknown>(props.value);

    useEffect(() => {
        if (imageFile != null) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(imageFile);
        } else {
            setPreview(() => {
                let previewURL: string | null;
                if (typeof imgURL === "string") {
                    previewURL = imgURL;
                } else {
                    previewURL = imgURL(value);
                }

                return previewURL;
            });
        }
    }, [imageObj, imageFile, imgURL, value]);

    const triggerChange = useCallback(
        (changedValue: unknown) => {
            onChange?.(changedValue);
        },
        [onChange]
    );

    const removeImage = useCallback(() => {
        setImageFile(null);
        const obj = transform?.("");
        setImageObj(obj);
        triggerChange(obj);
    }, [transform, triggerChange]);

    const wrapBeforeUpload = useCallback(
        (file: RcFile, fileList: RcFile[]): boolean | Promise<void | Blob | File> => {
            if (beforeUpload != null) {
                const beforeAction = beforeUpload(file, fileList);

                if (typeof beforeAction === "boolean") {
                    if (beforeAction) {
                        setImageFile(file);
                    }

                    return beforeAction && !disableAutoUpload;
                }

                if (disableAutoUpload) {
                    beforeAction.then((value) => {
                        if (value != null) {
                            setImageFile(value);
                        }
                        return value;
                    });

                    return false;
                }

                return beforeAction.then((value) => {
                    if (value != null) {
                        setImageFile(value);
                    }
                    return value;
                });
            }
            return !disableAutoUpload;
        },
        [beforeUpload, disableAutoUpload]
    );

    const upload = useCallback(
        async (file: Blob): Promise<unknown> => {
            const formData = new FormData();
            formData.append(name || "file", file);
            try {
                const resp = await Ajax.post<{ key: string }>(action, formData);
                const obj = transform?.(resp.data.key) || resp.data.key;
                setImageObj(obj);
                triggerChange(obj);
                return obj;
            } catch (e) {
                throw e;
            }
        },
        [name, action, transform, triggerChange]
    );

    const customUpload = useCallback(
        (uploadReq: RcCustomRequestOptions) => {
            upload(uploadReq.file).then(() => {
                //do nothing
            });
        },
        [upload]
    );

    useImperativeHandle(
        ref,
        () => ({
            remove: removeImage,
            getValue: () => {
                return imageObj;
            },
            upload: async (): Promise<unknown> => {
                if (imageFile != null) {
                    return upload(imageFile);
                }

                return imageObj;
            },
        }),
        [upload, imageFile, removeImage, imageObj]
    );

    const uploadUI = (
        <Upload
            name="avatar"
            listType="picture-card"
            showUploadList={false}
            maxCount={1}
            fileList={[]}
            customRequest={customUpload}
            beforeUpload={wrapBeforeUpload}
            {...others}>
            {children}
            {children == null &&
                (previewUrl == null ? (
                    <div style={preview?.style} className={preview?.className}>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>{preview?.uploadText || "Upload"}</div>
                    </div>
                ) : (
                    <div style={preview?.style} className={preview?.className}>
                        <Image alt="avatar" src={previewUrl} {...preview?.size} preview={false} />
                        <Button
                            type={"default"}
                            onClick={(e) => {
                                removeImage();
                                e.stopPropagation();
                            }}>
                            {preview?.removeText || "Remove"}
                        </Button>
                    </div>
                ))}
        </Upload>
    );

    if (crop != null) {
        return <ImgCrop {...crop}>{uploadUI}</ImgCrop>;
    }

    return uploadUI;
};

export const ImageValue = React.forwardRef(ImageValueComponent);

export const useImageValue = function <T = unknown>(): MutableRefObject<ImageValueRef<T>> {
    return useRef<ImageValueRef<T>>({
        getValue(): T | null {
            return null;
        },
        remove(): void {
            //do nothing
        },
        upload(): Promise<T | null> {
            return Promise.resolve(null);
        },
    });
};
