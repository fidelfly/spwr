export const PathSeparator = "/";
export const Path = {
    getTopParent: (path: string, keep = 2): string => {
        const pa = Path.resolvePath(path);
        if (pa.length <= keep) {
            return path;
        }
        return PathSeparator + pa.slice(0, keep).join(PathSeparator);
    },
    resolvePath: (path: string): string[] => {
        let pa = path.split(PathSeparator);
        if (pa.length > 0 || pa[0].length === 0) {
            pa = pa.slice(1);
        }
        return pa;
    },
    getParent: (path: string, min = 2): string => {
        const pa = Path.resolvePath(path);
        if (pa.length <= min) {
            return path;
        }
        return PathSeparator + pa.slice(0, pa.length - 1).join(PathSeparator);
    },
};
