/**
 * Spam trap: invisible to people and assistive tech, but naive bots fill it in.
 * The API silently discards any submission where `website` has a value.
 */
export function HoneypotField() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute h-0 w-0 overflow-hidden opacity-0">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
    </div>
  );
}
