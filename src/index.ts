import { HockeyOfficial } from "./hockey-official";

let official: HockeyOfficial = new HockeyOfficial();

official.initialize();

setTimeout(() => {
    official.shutdown();
}, 5000);
