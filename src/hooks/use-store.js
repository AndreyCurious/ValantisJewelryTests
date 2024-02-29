import { useContext } from "react";
import { StoreContext } from "../store/context";

/**
 * Хук для доступа к объекту хранилища
 * @return {Store}
 */
export default function useStore() {
  return useContext(StoreContext);
}
