# react-redux-datatable-api

Usage:

1.Add reducer
import { dataTableReducer } from '../datatable';

const rootReducer = combineReducers({
  ...
  ,dataTableReducer
});

2.Add component

import {DataTableRedux as DataTable} from '../../datatable';

//either field or render should be included with render preferred if both are present
<DataTable
      fields={[
              {"title":"Field A",'name':"field_a","render": {
                  transform: (value) => (
                      <Link to={`/url/display`} className="action-links">{value.field_a}</Link>
                  ),
              }}
              ,{"title":"Field B","field":"field_b","name":"field_b"}
              ,{"title":"Field C","field":"field_c","canSort":true,"name":"field_c"}
              ,{"title":"","field":"","canSort":false,"name":"action","cssClass":"text-center","render": {
                  transform: (value) => (
                      <div><a className="btn btn-sm btn-info" href={'/'+value.id} ><FontAwesomeIcon tag="i" icon={["fas", "edit"]} /> Edit</a>&nbsp;
                      <a className="btn btn-sm btn-danger" href={'/'+value.id}><FontAwesomeIcon tag="i" icon={["fas", "trash"]} /> Delete</a></div>
                  ),
              }}
          ]}
      ajax="/api/.../list"
      idField="id"
      defaultSort={['fieldA','asc']}
      customHeader={{'Authorization':'Bearer Token'}} />
      
  //response from api should be in the format (I used the same format that I had in Kendo Angular 2)
  
  {"totalRecords":77,"draw":0,"data":[{"id":4,"field_a":"My Value","field_b":25,"field_c":null},{"id":1,"field_a":"Another Value","field_b":11,"field_c":"xyz"}]}
