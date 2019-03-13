import React, { Component } from 'react';
import {Table,Pagination,PaginationItem,PaginationLink,Col,Row,FormGroup} from 'reactstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from 'prop-types';
import Loading from './DataTableLoading';
import '../dataTable.css';

const WAIT_INTERVAL = 1000;
const ENTER_KEY = 13;
const pageInputStyle = {
  marginLeft: '5px',
  marginRight: '5px'
}
const sortLinkStyle = {
  marginLeft: '10px',
  color: 'darkgray'
}

class DataTable extends Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    this.timer = null;
    this.props.initializeDataTable(this.props.customHeader,this.props.ajax, this.props.fields, this.props.idField,this.props.defaultSort);
  }

  columnSize() {
    const tableSize = Object.keys(this.props.fields).length;
    let colSize = Math.floor(12 / tableSize);
    if (colSize === 0)
      colSize = 1;
    return 'col-md-' + colSize;
  }

  renderHead() {
    const fields = this.props.fields;
    const th = fields.map((key) => {
      if(!("canSort" in key) || key.canSort)
        return(<th key={key.name}>{key.title}<span className="float-right">{this.renderSort(key.name)}</span></th>); 
      else{
        return(<th key={key.name}>{key.title}</th>); 
      }
    })
    return (
      <thead>
        <tr>
          {th}
        </tr>
      </thead>
    );
  }

  renderSort(key) {
    const ascActive = this.props.sortField === key && this.props.sortDirection === 'asc';
    const descActive = this.props.sortField === key && this.props.sortDirection === 'desc';
    const ascColor = ascActive ? 'black' : 'darkgray';
    const descColor = descActive ? 'black' : 'darkgray';
    return (
        <a style={sortLinkStyle} onClick={() => this.onSortClick(key, ascActive, descActive)}>          
          <FontAwesomeIcon tag="span" size="2x" key={key + '-up'} style={{color: ascColor}} icon={["fas", "caret-up"]} />
          <FontAwesomeIcon tag="span" size="2x" key={key + '-down'} style={{color: descColor}} icon={["fas", "caret-down"]} />
        </a>
    );
  }

  onSortClick(field, ascActive, descActive) {
    if (ascActive) {
      this.props.sort(field, 'desc');
    } else {
      this.props.sort(field, 'asc')
    }
  }

  getTotalPages() {
    return Math.ceil(this.props.totalRecords / this.props.perPage);
  }

  renderPageButtons() {
    const totalPages = this.getTotalPages();
    const page = this.props.page;
    const previousActive = page > 1;
    const nextActive = page < totalPages;
    const firstLink = <PaginationItem disabled={!previousActive} key='first'><PaginationLink onClick={() => this.props.goToPage(1)}>&lt;&lt;</PaginationLink></PaginationItem>;
    const lastLink = <PaginationItem disabled={!nextActive} key='last'><PaginationLink  onClick={() => this.props.goToPage(totalPages)}>&gt;&gt;</PaginationLink></PaginationItem>;
    const previousLink = <PaginationItem disabled={!previousActive} key='prev'><PaginationLink  onClick={() => this.props.previousPage()}>&lt;</PaginationLink></PaginationItem>;
    const nextLink = <PaginationItem disabled={!nextActive} key='next'><PaginationLink  onClick={() => this.props.nextPage()}>&gt;</PaginationLink></PaginationItem>;

    let links = [];
    if(totalPages <= 10) {
      for (let i = 1; i <= totalPages; i++) {
        const active = page === i;
        links.push(<PaginationItem key={i} active={active}><PaginationLink key={i} onClick={() => this.props.goToPage(i)}>{i}</PaginationLink></PaginationItem>);
      }
    } else {
      if (page > 4)
        links.push(<PaginationItem key='e-down'><PaginationLink onClick={() => this.props.ellipLeft()}>...</PaginationLink></PaginationItem>);
      for (let i = page - 8; i <= page + 8; i++) {
        const active = page === i;
        if (i > 0 && i <= totalPages) {
          if (i < page - 3) {
            if (page + 4 <= totalPages && page - 4 >= 1) continue;

            const leftPad = 7 - (totalPages - page);
            if ((page - i) <= leftPad) {
              links.push(<PaginationItem key={i} active={active}><PaginationItem onClick={() => this.props.goToPage(i)}>{i}</PaginationItem></PaginationItem>);
            }
          } else if (i > page + 3) {
            if (totalPages >= page + 4 && page - 4 >= 1) continue;

            const rightPad = 8 - page;
            if ((i - page) <= rightPad) {
              links.push(<PaginationItem key={i} active={active}><PaginationLink onClick={() => this.props.goToPage(i)}>{i}</PaginationLink></PaginationItem>);
            }
          } else {
            links.push(<PaginationItem key={i} active={active}><PaginationLink onClick={() => this.props.goToPage(i)}>{i}</PaginationLink></PaginationItem>);
          }
        }
      }
      if (page <= totalPages - 4)
        links.push(<PaginationItem key='e-up'><PaginationLink onClick={() => this.props.ellipRight()}>...</PaginationLink></PaginationItem>);
    }

    
    return (
      <Pagination size="sm">
        {firstLink}
        {previousLink}
        {links}
        {nextLink}
        {lastLink}
      </Pagination>
    );
  }

  renderBody() {
    const values = Object.values(this.props.fields);
    const data = this.props.data;

    const tr = data.map((datum) => {
      const td = values.map((field) => {
        var tdId = String(datum[this.props.idField]) + "-" + field.name;
        if(field.render){
          return (<td key={tdId} className={field.cssClass||""}>{field.render.transform(datum)}</td>);
        }
        else{
          return(<td key={tdId} className={field.cssClass||""}>{datum[field.field]}</td>); 
        }
      });

      return(
        <tr className="" key={datum[this.props.idField]}>
          {td}
        </tr>
      );
    });
    return (
      <tbody>
        {tr}
      </tbody>
    );
  }

  handlePageInput(event) {
    clearTimeout(this.timer);
    const newPage = Number(event.target.value);
    if (newPage < 1 || newPage > this.getTotalPages()) {
      event.target.value = '';
      return;
    }
    event.persist();
    this.timer = setTimeout(() => {
      if (event.target !== null)
        this.props.goToPage(event.target.value);
        event.target.placeholder = event.target.value;
        event.target.value = '';
    }, WAIT_INTERVAL);
  }



  handlePageInputKeyDown(event) {
    const value = event.target.value;
    const newPage = Number(event.target.value);

    if (newPage < 1 || newPage > this.getTotalPages()) {
      event.target.value = '';
      return;
    }
    if (event.keyCode === ENTER_KEY) {
      clearTimeout(this.timer);
      this.props.goToPage(value);
      event.target.placeholder = value;
      event.target.value = '';
    }
  }

  handleSearchChange(event) {
    const value = event.target.value;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      if (value !== null)
        this.props.searchTable(value);

    }, WAIT_INTERVAL);
  }

  renderLoading() {
    if (!this.props.loading) return;
    return (
      <Loading />
    );
  }

  renderSearch() {
    return (
      <FormGroup className="text-right">
        <input 
          className="form-control"
          type="text"
          placeholder="Search"
          onChange={this.handleSearchChange.bind(this)}
        />
      </FormGroup>
    )
  }

  render() {
    return (
      <div className='datatable-wrapper' >
        <Col xs="8" md={{size:4,offset:8}}>
          {this.renderSearch()}
        </Col>
        <Table striped bordered hover responsive>
          {this.renderHead()}
          {this.renderBody()}
        </Table>        
        {this.renderLoading()}
        <Row>
          <Col xs="8">
            <div>Page
              <span>
                <input type="text" style={pageInputStyle} className="text-center page-input" size={2} onChange={(event) => this.handlePageInput(event)} onKeyDown={(event) => this.handlePageInputKeyDown(event)} placeholder={this.props.page} />
                of {this.getTotalPages()}
              </span>
            </div>          
          </Col>
          <Col xs="4" className="text-right">
          <div>
            <span>
              <select style={pageInputStyle} value={this.props.perPage} onChange={(event) => this.props.changePerPage(event.target.value)}>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              per page
            </span>
          </div>
        </Col>
        </Row>
        <Row>
          <Col xs="12" className="text-center">
          {this.renderPageButtons()}
          </Col>
        </Row>
      </div>
    );
  }
}

DataTable.propTypes = {
  fields: PropTypes.array,
  data: PropTypes.array,
  idField: PropTypes.string,
  totalRecords: PropTypes.number,
  perPage: PropTypes.number,
  page: PropTypes.number
}

export default DataTable;