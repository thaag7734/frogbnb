function ErrorSpan({ msg }) {
  return msg ? <span className="error">{msg}</span> : undefined;
}

export default ErrorSpan;
