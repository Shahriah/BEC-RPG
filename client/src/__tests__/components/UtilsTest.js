import { cn } from '../../lib/utils';

describe('cn utility function', () => {
  test('concatenates simple class names', () => {
    expect(cn("p-4", "text-center")).toBe("p-4 text-center");
  });

  test('ignores falsy values', () => {
    expect(cn("p-4", false, null, undefined, "", "text-center")).toBe("p-4 text-center");
  });

  test('merges conflicting tailwind classes', () => {
    
    expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500");
  });

  test('handles nested arrays', () => {
    
    expect(cn(["p-4", "m-2"], "text-center")).toBe("p-4 m-2 text-center");
  });

  test('handles conditional classes', () => {
    const isActive = true;
    const isDisabled = false;
    expect(cn("btn", isActive && "btn-active", isDisabled && "btn-disabled")).toBe("btn btn-active");
  });

  test('handles object syntax', () => {
    
    expect(cn({ "p-4": true, "text-center": false })).toBe("p-4");
  });

  test('combines multiple types of inputs', () => {
    const additional = "mt-2";
    expect(
      cn("p-4", ["bg-red-500", false], { "text-center": true, "text-left": false }, additional)
    ).toBe("p-4 bg-red-500 text-center mt-2");
  });
});
