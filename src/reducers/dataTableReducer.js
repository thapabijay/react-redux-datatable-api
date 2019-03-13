const INITIAL_STATE = {
  draw: 0,
  page: 1,
  perPage: 10,
  data: [],
  loading: true,
  customHeader:{},
  ajax: '',
  totalRecords: 0,
  fields: [],
  idField: '',
  sortField: null,
  sortDirection: null,
  searchValue: ''
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'table_loading':
      return {
        ...state,
        loading: true,
        draw: state.draw + 1
      }
    case 'search_table':
      return {
        ...state,
        loading: false,
        data: action.data,
        totalRecords: action.totalRecords,
        page: action.page,
        searchValue: action.searchValue
      }
    case 'go_to_page':
      return {
        ...state,
        loading: false,
        page: action.page,
        data: action.data,
      }
    case 'change_per_page':
      return {
        ...state,
        loading: false,
        perPage: action.perPage,
        data: action.data,
        page: 1
      }
    case 'sort_table':
      return {
        ...state,
        loading: false,
        data: action.data,
        sortField: action.sortField,
        sortDirection: action.sortDirection
      }
    case 'initialize_table':
      return {
        ...state,
        data: action.data,
        loading: false,
        draw: 1,
        customHeader:action.customHeader,
        ajax: action.ajax,
        totalRecords: action.totalRecords,
        fields: action.fields,
        idField: action.idField,
        sortField: action.sortField,
        sortDirection:action.sortDirection,
        searchValue: ''
      }
    case 'next_page':
      return {
        ...state,
        data: action.data,
        page: state.page + 1,
        loading: false
      };
    case 'previous_page':
      return {
        ...state,
        data: action.data,
        page: state.page - 1,
        loading: false
      };
    default:
      return state;
  }
}