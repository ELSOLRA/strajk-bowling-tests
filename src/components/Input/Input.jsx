import "./Input.scss";

function Input({
  label,
  type,
  customClass,
  name,
  handleChange,
  defaultValue,
  disabled,
  maxLength,
}) {
  const inputId = `input-${(name ?? label).toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <section className="input">
      <label className="input__label" htmlFor={inputId}>
        {label}
      </label>
      <input
        id={inputId}
        type={type}
        className={`input__field ${customClass ? customClass : ""}`}
        name={name}
        onChange={handleChange}
        defaultValue={defaultValue ? defaultValue : ""}
        maxLength={maxLength}
        disabled={disabled}
      />
    </section>
  );
}

export default Input;
