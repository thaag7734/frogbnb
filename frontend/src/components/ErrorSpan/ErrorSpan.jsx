function ErrorSpan({ msg }) {
  return msg ? <span class="error">{msg}</span> : undefined;
}
