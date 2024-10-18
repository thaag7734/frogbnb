function ErrorSpan({ msg }) {
  return msg ? <span class="error">{msg}</span> : undefined;
}

export default ErrorSpan;
