import React from 'react';
import './strenght.css';

function Passwordstrenghtindicator({
  validity: { minChar, number, specialChar },
}) {
  return (
    <div className='strenght-box'>
      <PasswordStrenghtIndicatorItem
        isValid={minChar}
        text='Must have atleast 8 characters'
      />
      <PasswordStrenghtIndicatorItem
        isValid={number}
        text='Must have atleast 1 number'
      />
      <PasswordStrenghtIndicatorItem
        isValid={specialChar}
        text='Must have atleast 1 special character'
      />
    </div>
  );
}

const PasswordStrenghtIndicatorItem = ({ isValid, text }) => {
  const highlightClass = isValid
    ? 'text-sucess'
    : isValid !== null
    ? 'text-danger'
    : '';
  return <div className={highlightClass}>{text}</div>;
};
export default Passwordstrenghtindicator;
