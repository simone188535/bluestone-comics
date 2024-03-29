import React from "react";
import { Field } from "formik";

const FilterOptions = ({
  fieldName,
  option,
  headerText,
  isDropdown = false,
  component: Component,
  disabled = false,
}) => {
  const searchType = option.map(({ opt, value }) => (
    <Component
      key={`search-type-${opt}`}
      fieldName={!isDropdown ? fieldName : undefined}
      opt={opt}
      value={value}
      disabled={disabled}
    />
  ));

  const wrap = isDropdown ? (
    <Field as="select" name={fieldName}>
      {searchType}
    </Field>
  ) : (
    searchType
  );

  return (
    <>
      <p className="search-section-header">
        Select a <strong>{headerText}</strong>:
      </p>
      <div className="search-type-radio search-section-body">{wrap}</div>
    </>
  );
};

export default FilterOptions;
