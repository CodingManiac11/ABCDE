import { useDispatch, useSelector, useStore } from 'react-redux';
import { useCallback } from 'react';

/**
 * Custom hook for type-safe Redux selector
 * @template T - The type of the selected state
 * @param {Function} selector - The selector function
 * @param {Array} [deps=[]] - Dependencies array for memoization
 * @returns {T} The selected state
 */
export const useAppSelector = (selector, deps = []) => {
  // Memoize the selector to prevent unnecessary recalculations
  const memoizedSelector = useCallback(
    (state) => selector(state),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selector, ...deps]
  );
  
  return useSelector(memoizedSelector);
};

/**
 * Custom hook for type-safe Redux dispatch
 * @returns {Function} The Redux dispatch function
 */
export const useAppDispatch = () => {
  const dispatch = useDispatch();
  
  // Wrap the dispatch function to add type safety
  return useCallback(
    (action) => {
      return dispatch(action);
    },
    [dispatch]
  );
};

/**
 * Custom hook to get the Redux store
 * @returns {Object} The Redux store
 */
export const useAppStore = () => {
  return useStore();
};

/**
 * Custom hook for handling loading, success, and error states
 * @param {string} actionType - The action type to listen for
 * @returns {Object} An object containing loading, success, and error states
 */
export const useAsyncStatus = (actionType) => {
  const status = useAppSelector((state) => {
    const action = state._actions?.[actionType];
    
    if (!action) {
      return {
        loading: false,
        success: false,
        error: null,
      };
    }
    
    return {
      loading: action.pending || false,
      success: action.fulfilled || false,
      error: action.error ? action.payload || action.error : null,
    };
  });
  
  return status;
};

/**
 * Custom hook for handling form state in Redux
 * @param {string} formName - The name of the form
 * @returns {Object} An object containing form state and helpers
 */
export const useFormState = (formName) => {
  const formState = useAppSelector((state) => state.form?.[formName]);
  const dispatch = useAppDispatch();
  
  const setFieldValue = useCallback(
    (field, value) => {
      dispatch({
        type: 'form/SET_FIELD_VALUE',
        payload: { form: formName, field, value },
      });
    },
    [dispatch, formName]
  );
  
  const setFormValues = useCallback(
    (values) => {
      dispatch({
        type: 'form/SET_FORM_VALUES',
        payload: { form: formName, values },
      });
    },
    [dispatch, formName]
  );
  
  const resetForm = useCallback(() => {
    dispatch({
      type: 'form/RESET_FORM',
      payload: { form: formName },
    });
  }, [dispatch, formName]);
  
  const setFormErrors = useCallback(
    (errors) => {
      dispatch({
        type: 'form/SET_FORM_ERRORS',
        payload: { form: formName, errors },
      });
    },
    [dispatch, formName]
  );
  
  const setFormStatus = useCallback(
    (status) => {
      dispatch({
        type: 'form/SET_FORM_STATUS',
        payload: { form: formName, status },
      });
    },
    [dispatch, formName]
  );
  
  return {
    values: formState?.values || {},
    errors: formState?.errors || {},
    touched: formState?.touched || {},
    status: formState?.status || {},
    setFieldValue,
    setFormValues,
    resetForm,
    setFormErrors,
    setFormStatus,
  };
};

/**
 * Custom hook for handling pagination state
 * @param {string} entityName - The name of the entity
 * @param {Object} [initialPagination] - Initial pagination state
 * @returns {Object} Pagination state and handlers
 */
export const usePagination = (entityName, initialPagination = {}) => {
  const pagination = useAppSelector(
    (state) => state.pagination?.[entityName] || {
      page: 1,
      pageSize: 10,
      total: 0,
      ...initialPagination,
    }
  );
  
  const dispatch = useAppDispatch();
  
  const setPage = useCallback(
    (page) => {
      dispatch({
        type: 'pagination/SET_PAGE',
        payload: { entity: entityName, page },
      });
    },
    [dispatch, entityName]
  );
  
  const setPageSize = useCallback(
    (pageSize) => {
      dispatch({
        type: 'pagination/SET_PAGE_SIZE',
        payload: { entity: entityName, pageSize },
      });
    },
    [dispatch, entityName]
  );
  
  const setTotal = useCallback(
    (total) => {
      dispatch({
        type: 'pagination/SET_TOTAL',
        payload: { entity: entityName, total },
      });
    },
    [dispatch, entityName]
  );
  
  const resetPagination = useCallback(() => {
    dispatch({
      type: 'pagination/RESET',
      payload: { entity: entityName },
    });
  }, [dispatch, entityName]);
  
  return {
    ...pagination,
    setPage,
    setPageSize,
    setTotal,
    resetPagination,
  };
};

/**
 * Custom hook for handling filters state
 * @param {string} filterName - The name of the filter set
 * @param {Object} [initialFilters] - Initial filters
 * @returns {Object} Filters state and handlers
 */
export const useFilters = (filterName, initialFilters = {}) => {
  const filters = useAppSelector(
    (state) => state.filters?.[filterName] || initialFilters
  );
  
  const dispatch = useAppDispatch();
  
  const setFilter = useCallback(
    (filter, value) => {
      dispatch({
        type: 'filters/SET_FILTER',
        payload: { filterSet: filterName, filter, value },
      });
    },
    [dispatch, filterName]
  );
  
  const setFilters = useCallback(
    (newFilters) => {
      dispatch({
        type: 'filters/SET_FILTERS',
        payload: { filterSet: filterName, filters: newFilters },
      });
    },
    [dispatch, filterName]
  );
  
  const resetFilters = useCallback(() => {
    dispatch({
      type: 'filters/RESET_FILTERS',
      payload: { filterSet: filterName },
    });
  }, [dispatch, filterName]);
  
  return {
    filters,
    setFilter,
    setFilters,
    resetFilters,
  };
};
