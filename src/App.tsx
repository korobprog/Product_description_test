import React, { useState, useMemo } from 'react';

interface Param {
  id: number;
  name: string;
  type: 'string';
}

interface ParamValue {
  paramId: number;
  value: string;
}

interface Model {
  paramValues: ParamValue[];
  colors: string[];
}

interface Props {
  params: Param[];
  model: Model;
}

const ParamInput: React.FC<{
  param: Param;
  value: string;
  onChange: (value: string) => void;
}> = ({ param, value, onChange }) => {
  if (param.type === 'string') {
    return (
      <input
        type="text"
        placeholder={param.name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }
  return null;
};

const App: React.FC<Props> = ({ params, model }) => {
  const [paramValues, setParamValues] = useState<ParamValue[]>(() => {
    const paramValueMap = new Map(
      model.paramValues.map((pv) => [pv.paramId, pv.value])
    );
    return params.map((param) => ({
      paramId: param.id,
      value: paramValueMap.get(param.id) || '',
    }));
  });

  const handleChange = (paramId: number, newValue: string) => {
    setParamValues((prev) =>
      prev.map((pv) =>
        pv.paramId === paramId ? { ...pv, value: newValue } : pv
      )
    );
  };

  const valueMap = useMemo(
    () => new Map(paramValues.map((pv) => [pv.paramId, pv.value])),
    [paramValues]
  );

  return (
    <div>
      {params.map((param) => (
        <div key={param.id}>
          <label>{param.name}</label>
          <ParamInput
            param={param}
            value={valueMap.get(param.id) || ''}
            onChange={(newValue) => handleChange(param.id, newValue)}
          />
        </div>
      ))}
    </div>
  );
};

export default App;
