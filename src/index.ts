import { useState, useCallback } from "react";
import _ from "lodash";

interface GenericSelectObject<Type> {
  [key: string]: Type;
}

export const useMultiSelect = <T>() => {
  const [objStore, setObjStore] = useState<GenericSelectObject<T>>({});
  const [storeKeys, setStoreKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const hasKey = useCallback((key: string) => _.has(objStore, key), [objStore]);

  const addObjToStore = useCallback(
    (obj: T, keyPrefix = "") => {
      let key = `${_.toString(Date.now())}`;
      if (keyPrefix) key = `${keyPrefix}_${key}`;
      setObjStore((prevStore: GenericSelectObject<T>) => ({
        ...prevStore,
        [key]: obj,
      }));
      setStoreKeys((prevKeys) => _.uniq([...prevKeys, key]));
      return key;
    },
    [setObjStore, setStoreKeys]
  );

  const delObjFromStore = useCallback(
    (key: string) => {
      setObjStore((prevStore) => _.omit(prevStore, key));
      setStoreKeys((prevState) => _.pull(prevState, key));
      setSelectedKeys((prevState) => _.pull(prevState, key));
    },
    [setObjStore, setStoreKeys, setSelectedKeys]
  );

  const delAllObjs = useCallback(() => {
    setObjStore({});
    setStoreKeys([]);
    setSelectedKeys([]);
  }, [setObjStore, setStoreKeys, setSelectedKeys]);

  const selectObj = useCallback(
    (key: string) => {
      if (hasKey(key))
        setSelectedKeys((prevState) => _.uniq([...prevState, key]));
    },
    [setSelectedKeys, hasKey]
  );

  const unSelectObj = useCallback(
    (key: string) => {
      setSelectedKeys((prevState) => _.uniq(_.pull([...prevState], key)));
    },
    [setSelectedKeys]
  );

  const selectAll = useCallback(() => {
    setSelectedKeys(storeKeys);
  }, [setSelectedKeys, storeKeys]);

  const unSelectAll = useCallback(() => {
    setSelectedKeys([]);
  }, [setSelectedKeys]);

  return {
    objStore,
    storeKeys,
    selectedKeys,
    addObjToStore,
    delObjFromStore,
    delAllObjs,
    selectObj,
    unSelectObj,
    selectAll,
    unSelectAll,
  };
};
