const xrayOptions = {
    filters: {
        escapeName: function (value) {
            return value.replace("%20", " ");
        },
        trim: function (value) {
            return value.trimLeft().trimRight();
        },
        trimType: function (value) {
            return value.replace("type ", "");
        },
        trimSlash: function (value) {
            return value.replace("/", "");
        }
    },
};
const xray = require("x-ray")(xrayOptions);

xray("https://pikalytics.com/", ".pokedex_entry", [
    {
        name: "@data-name | escapeName",
        // stats: xray("a@href", {value: "#bstats_wrapper > div > div > div > div"}),
        info: xray("a@href", {
            stats: xray("#bstats_wrapper > div > div > div", [{ name: "div:first-child", value: "div:nth-child(3)" }]),
            moves: xray("#moves_wrapper > div > div", [
                {
                    name: "div:first-child@text",
                    type: "span[class^=type]@class | trimType",
                    percentage: "div:last-child@text",
                },
            ]),
            items: xray("#items_wrapper > div", [
                {
                    name: "div:nth-child(2)@text",
                    percentage: "div:nth-child(3)@text",
                },
            ]),
            abilities: xray("#abilities_wrapper > div > div", [
                {
                    name: "div:first-child@text",
                    percentage: "div:last-child@text",
                },
            ]),
            spread: xray("#dex_spreads_wrapper > div > div", [{
                nature: "div:first-child@text",
                ivs: {
                    HP: "div:nth-child(2)@text | trimSlash",
                    ATK: "div:nth-child(3)@text | trimSlash",
                    Def: "div:nth-child(4)@text | trimSlash",
                    SpA: "div:nth-child(5)@text | trimSlash",
                    SpD: "div:nth-child(6)@text | trimSlash",
                    Spe: "div:nth-child(7)@text | trimSlash",
                },
                percentage: "div:last-child@text"
            }]),
            teammates: xray("#dex_team_wrapper a", [{
                name: "@data-name | escapeName",
                percentage: "a > div:last-child@text"
            }]),
        }),
    },
]).write("results.json");
