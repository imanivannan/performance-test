import cloneDeep from "lodash/cloneDeep";
import { AgGridReact } from "ag-grid-react";
import React, { Component }  from "react";
import { connect} from "react-redux";
import { withRouter } from "react-router-dom";
import Log from "../../log/Log";
import { ODD_SELECTOR,getDocs, updateTime } from "../../features/test/TestSlice";
import './Test.scss';
const CLASS_NAME = "TestMonitor";


const defaultColDef = {
  width: 100,
  editable: false,
  filterable: true,
  resizable: false,
  sortable: true,
}        


const columnDefs = [
  {
    headerName: "Id",
    field: "id", 
    width: 100,
    sortable:true,
    sort:"desc",

  },
  {
    headerName: "First Name",
    field: "firstName",
  },
 
  {
    headerName: "Last Name",
    field: "lastName",
    width: 100,
  },
  {
    headerName: "Age",
    field: "age",
    width: 45,
  },      
  {
    headerName: "City",
    field: "city",
    width: 100,
  },  
  {
    headerName: "New Attribute",
    field: "myNewAttribute",
    width: 150,
  },
  {
    headerName: "Time",
    field: "time",
    width: 200,
  },
  {
    headerName: "State",
    field: "testState",
    width :120,
  }      

]

class TestMonitor extends Component {
  childInquiryState = "ODD";
  rowData = new Array(0);
  timerId=-1;
  gridApi = null;
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      error: "",         
      gridColumnApi : null,
    };
    Log.trace(CLASS_NAME,'Constructed');
  }

 /**
  * 
  * @param {*} params - grid
  */ 
 onGridReady = params => 
 {
  Log.trace(CLASS_NAME,' OnGridReady Grid API is ready');
  this.gridApi = params.api;
  this.setState({gridColumnApi :params.columnApi});
  Log.trace(CLASS_NAME,' OnGridReady UI['+this.rowData.length+'], STORE['+this.props.docs.length);
  this.startTimer();
};


stopTimer()
{
  Log.trace(CLASS_NAME,' Timer['+this.timerId+'] clearing');
  clearInterval(this.timerId);
  Log.trace(CLASS_NAME,' Timer['+this.timerId+'] cleared');
}

startTimer()
{
  if(!this.timerStarted)
  {
    this.timerId = setInterval(this.timerHandler3, 1000,CLASS_NAME,this.props);  
    Log.trace(CLASS_NAME,' Timer['+this.timerId+'] started');
  }
}

timerHandler3(gridApi)
{
}
componentWillUnmount()
{
  this._isMounted = false;
  Log.trace(CLASS_NAME,' WillUnmount UI['+this.rowData.length+'], STORE['+this.props.docs.length);
  //this.stopTimer();
  Log.trace(CLASS_NAME,'  WillUnmount Timer['+this.timerId+'] cleared');
}

printStat2(num,props)
{
  if(props)
  {
    Log.trace(CLASS_NAME,
      ' ShouldUpdate '+num+' UI['+this.rowData?this.rowData.length:'bad'+
      '], Inquiry Store ['+  props.docs.length+
      "]");
  }
}
/**
static getDerivedStateFromProps(props, state)
{
  Log.trace(CLASS_NAME,"getDerivedStateFromProps called");
  return state;
}
*/


printResult(res) 
{
 
  
  if (res.add) {
    res.add.forEach(function (rowNode) {
      console.log('Added Row Node', rowNode);
    });
  }
  if (res.remove) {
    res.remove.forEach(function (rowNode) {
      console.log('Removed Row Node', rowNode);
    });
  }
  if (res.update) {
    res.update.forEach(function (rowNode) {
      console.log('Updated Row Node', rowNode);
    });
  }
  
}

shouldComponentUpdate(nextProps, nextState)
{
     
   if(nextProps.event!== null)
   {
    var t1 = performance.now();    
    //Log.trace(CLASS_NAME,"Before "+this.rowData.length);
     //var rowToBeAdded = cloneDeep(nextProps.event);
     //var newRows =  cloneDeep(nextProps.docs);
     //nextState.gridApi.setRowData(newRows);
     //var newRows = new Array(0);
     //newRows.push(nextProps.event);
     //var res = this.gridApi.applyTransaction({ add: newRows});
     //this.printResult(res);
     //this.rowData.push(rowToBeAdded);     
     var t2 = performance.now();
     //Log.trace(CLASS_NAME,"After "+this.rowData.length);
     //Log.trace(CLASS_NAME,"shouldComponentUpdate Event "+(t2-t1)+' ms');
     return true;
   }else if(nextProps.initial===true)
   {
     //this.gridApi.setRowData()
     //this.rowData = cloneDeep(nextProps.docs);
     //let difference = nextProps.docs.filter(x => !this.rowData.includes(x));
     //this.rowData.push(difference);
     //Log.trace(CLASS_NAME,"shouldComponentUpdate Initial "+this.rowData.length);
     return true;
   }else
   {
     return false;
   }
    
}
 

componentDidMount() {

  this._isMounted=true;
  this.props.getDocs();
  Log.trace(CLASS_NAME," DidMount,Docs="+this.props.docs.length);  

}

onRowDataChanged()
{
  Log.trace(CLASS_NAME,'Row Data Changed ');
}
onRowDataUpdated()
{
  Log.trace(CLASS_NAME,'Row Data Updated');
}

onSortChanged(event)
{
  //event.api.setRowData(this.props.docs);
  Log.trace(CLASS_NAME,'Sorting Changed');
}
getRowNodeId(data)
{
  return data.id;
}

    /**
   * Default render method for the component
   */
  render() {
    //const timerId = this.timerId;
    Log.trace(CLASS_NAME,' 111111111111111111111111111111111');
     
      return (
        <div style={{ width: '100%', height: '100%' }}> 
        <div style={{color:'black'}}> Row Count = {this.props.docs.length}<br/></div>
        <div
          id="bidGrid"
          style={{
            height: '1800px',
            width: '2000px',
          }}
          className="ag-theme-custom-react" >
            
            <AgGridReact   
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              rowHeight="25"
              rowData = {this.props.docs}
              onGridReady={this.onGridReady}
              getRowNodeId= {this.getRowNodeId}
              onRowDataChanged={this.onRowDataChanged}
              onRowDataUpdated={this.onRowDataUpdated}
              onSortChanged={this.onSortChanged}
              immutableData={true}
            ></AgGridReact>
            
          </div>
          </div>
      );
    
  }
}

const mapStateToProps = (state) => {
  return {
    docs : ODD_SELECTOR(state),
    event : state.testStore.testEvent,
    initial : state.testStore.initial,
  };
};

const mapDispatchToProps = (dispatch) => ({
  getDocs: (payload) =>dispatch(getDocs(payload)),
  updateTime :() =>dispatch(updateTime()),
  
});


export default withRouter(connect(mapStateToProps, mapDispatchToProps,null,{ forwardRef: true })(TestMonitor));
