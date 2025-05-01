import React, { useState, useCallback } from 'react';

interface Param {
  id: number;
  name: string;
  type: 'string' | 'number' | 'select';
}

interface ParamValue {
  paramId: number;
  value: string;
}

interface Color {
  id: number;
  name: string;
}

interface Model {
  paramValues: ParamValue[];
  colors: Color[];
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
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Введите ${param.name.toLowerCase()}`}
        className="param-input"
      />
    );
  }
  return null;
};

const ParamEditor: React.FC<Props> = ({ params, model }) => {
  const initializeParamValues = useCallback((): ParamValue[] => {
    const valueMap = new Map<number, string>();
    model.paramValues.forEach((paramValue) => {
      valueMap.set(paramValue.paramId, paramValue.value);
    });

    return params.map((param) => ({
      paramId: param.id,
      value: valueMap.get(param.id) || '',
    }));
  }, [model.paramValues, params]);

  const [paramValues, setParamValues] = useState<ParamValue[]>(
    initializeParamValues
  );
  const [showModel, setShowModel] = useState(false);
  const [currentModel, setCurrentModel] = useState<Model | null>(null);

  const handleParamChange = useCallback((paramId: number, value: string) => {
    setParamValues((prevValues) =>
      prevValues.map((paramValue) =>
        paramValue.paramId === paramId ? { ...paramValue, value } : paramValue
      )
    );
  }, []);

  const getModel = useCallback(
    (): Model => ({
      paramValues: [...paramValues],
      colors: [...model.colors],
    }),
    [paramValues, model.colors]
  );

  const showCurrentModel = useCallback(() => {
    setShowModel(true);
    setCurrentModel(getModel());
  }, [getModel]);

  const valueMap = new Map<number, string>();
  paramValues.forEach((paramValue) => {
    valueMap.set(paramValue.paramId, paramValue.value);
  });

  return (
    <div className="param-editor">
      <h2>Редактор параметров</h2>
      <div className="param-list">
        {params.map((param) => (
          <div key={param.id} className="param-item">
            <label className="param-label">{param.name}</label>
            <ParamInput
              param={param}
              value={valueMap.get(param.id) || ''}
              onChange={(value) => handleParamChange(param.id, value)}
            />
          </div>
        ))}
      </div>

      <button onClick={showCurrentModel} className="get-model-btn">
        Показать полученную модель
      </button>

      {showModel && currentModel && (
        <div className="model-display">
          <h3>Полученная модель:</h3>
          <pre>{JSON.stringify(currentModel, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

function App() {
  const params: Param[] = [
    { id: 1, name: 'Назначение', type: 'string' },
    { id: 2, name: 'Длина', type: 'string' },
  ];

  const model: Model = {
    paramValues: [
      { paramId: 1, value: 'повседневное' },
      { paramId: 2, value: 'макси' },
    ],
    colors: [],
  };

  return (
    <>
      <ParamEditor params={params} model={model} />
    </>
  );
}

export { ParamEditor, ParamInput };
export default App;
