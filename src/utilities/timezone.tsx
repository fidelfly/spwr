export type Timezone = {
    country: string;
    code: string;
    offset: string;
};

export const TZData: Timezone[] = [
    {
        country: "CN",
        code: "Asia/Hong_Kong",
        offset: "+08:00",
    },
    {
        country: "CN",
        code: "Asia/Shanghai",
        offset: "+08:00",
    },
    {
        country: "SG",
        code: "Asia/Singapore",
        offset: "+07:00",
    },
];
