type SelectProps = {
  options: string[];
};

const Select = ({ options }: SelectProps) => {
  return (
    <select className="py-2">
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default Select;
