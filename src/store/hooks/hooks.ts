import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from "../store";


export const useAppDispatch = () => useDispatch<AppDispatch>(); // add a type to the dispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; // type the selector