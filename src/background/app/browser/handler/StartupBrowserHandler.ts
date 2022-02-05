import {Handler} from "../../base/handler/Handler";
import {browserHandlerService} from "../../BookmarkApplicationContext";

export default class StartupBrowserHandler implements Handler {

    private constructor(private handle: any = null) {
    }

    public static async build() {
        const startupBrowserHandler: StartupBrowserHandler = new StartupBrowserHandler();

        await startupBrowserHandler.init();

        return startupBrowserHandler;
    }

    async init(): Promise<void> {
        this.handle = async () => {
            console.debug('StartupBrowserHandler handle');

            await browserHandlerService.checkTxAndRunRestore();
        }
    }

    start(): void {
        browser.runtime.onStartup.addListener(this.handle);
    }

    stop(): void {
        browser.runtime.onStartup.removeListener(this.handle);
    }

}