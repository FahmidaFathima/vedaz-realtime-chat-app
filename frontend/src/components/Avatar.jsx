import { colorForName, initialOf } from "../utils.js"

export default function Avatar({ name, size = "md" }) {
  return (
    <span
      className={`avatar avatar-${size}`}
      style={{ background: colorForName(name) }}
      aria-hidden="true"
      title={name}
    >
      {initialOf(name)}
    </span>
  )
}
