import { RenderedState } from "../types";
export declare function newToken(): string;
export declare function setupHistoryAugmentationOnce({ renderedStateRef, }: {
    renderedStateRef: {
        current: RenderedState;
    };
}): {
    writeState: () => void;
};
//# sourceMappingURL=historyAugmentation.d.ts.map