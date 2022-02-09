import { AnyFunction } from "@codeleap/common";

export function stopPropagation(event: any) {
  const tryCalls = [
    event?.stopPropagation,
    event?.preventDefault,
    event.nativeEvent?.stopImmediatePropagation as AnyFunction,
  ];

  for (const call of tryCalls) {
    try {
      call();
    } catch (e) {}
  }
}
