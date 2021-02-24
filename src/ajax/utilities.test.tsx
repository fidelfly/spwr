import { AjaxKit } from "./utilities";

it("AjaxKit.getPath", () => {
    let vars = AjaxKit.getPath("{id}/user/{type}/ddd", ["abc"]);

    console.log(vars);

    vars = AjaxKit.getPath("/api/{id}/user/{type}/ddd", { id: "ok", type: 6 });

    console.log(vars);
});
