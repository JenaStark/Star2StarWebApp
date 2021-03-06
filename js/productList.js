/**
 * Created by Michael on 5/12/16.
 */

var ProductCategoryRow = React.createClass({
  render: function() {
    return (
      <tr id="productCategoryRow">
        <th colSpan="6">{this.props.category}</th>
      </tr>
    );
  }
});

var ProductRow = React.createClass({
  render: function() {
    var name = this.props.product.stocked ?
      this.props.product.name : <span style={{color: 'red'}}>{this.props.product.name}</span>;

    var stock = this.props.product.stocked

    return (
      <tr>
        <td>{this.props.product.postedDate}</td>
        <td>{name}</td>
          <td>{this.props.product.category}</td>
          <td>{this.props.product.postedDate}</td>
        <td>{this.props.product.endDate}</td>
          <td><input
              type="checkbox"
              checked={stock}
              ref="inStockOnlyInput"
              onChange={this.handleChange}
          /></td>
      </tr>
    );

  }
});

var ProductTable = React.createClass({
  render: function() {
    var rows = [];
    var lastCategory = null;
    this.props.products.forEach(function(product) {
      if (product.name.indexOf(this.props.filterText) === -1 || (!product.stocked && this.props.inStockOnly)) {
        return;
      }
      if (product.category !== lastCategory) {
        rows.push(<ProductCategoryRow category={product.category} key={product.category} />);
      }
      rows.push(<ProductRow product={product} key={product.name} />);
      lastCategory = product.category;
    }.bind(this));
    return (
        <div>
      <table id="productTable">
          <caption>Promotional List</caption>

        <thead>
        <tr>
          <th>Posted Date</th>
            <th>Name</th>
            <th>Description</th>
            <th>StartDate</th>
          <th>EndDate</th>
          <th>Done</th>
        </tr>
        </thead>

        <tbody>{rows}</tbody>
      </table>
            </div>
    );
  }
});

var SearchBar = React.createClass({
  handleChange: function() {
    this.props.onUserInput(
      this.refs.filterTextInput.value,
      this.refs.inStockOnlyInput.checked
    );
  },
  render: function() {
    return (
      <div>

          <form>
        <input
          type="text"
          placeholder="Search..."
          value={this.props.filterText}
          ref="filterTextInput"
          onChange={this.handleChange}
        />
          </form>


          <input
            type="checkbox"
            checked={this.props.inStockOnly}
            ref="inStockOnlyInput"
            onChange={this.handleChange}
          />
          {' '}
          Only show finished promotions


      </div>
    );
  }
});

var FilterableProductTable = React.createClass({
  getInitialState: function() {
    return {
      filterText: '',
      inStockOnly: false
    };
  },

  handleUserInput: function(filterText, inStockOnly) {
    this.setState({
      filterText: filterText,
      inStockOnly: inStockOnly
    });
  },

  render: function() {
    return (
      <div>
        <SearchBar
          filterText={this.state.filterText}
          inStockOnly={this.state.inStockOnly}
          onUserInput={this.handleUserInput}
        />
          <p>
        <ProductTable
          products={this.props.products}
          filterText={this.state.filterText}
          inStockOnly={this.state.inStockOnly}
        />
              </p>
      </div>
    );
  }
});



var PRODUCTS = [
  {category: 'Sporting Goods', price: '$49.99', stocked: true, name: 'Football', postedDate: '01/05/16', endDate: '01/06/16'},
  {category: 'Sporting Goods', price: '$9.99', stocked: true, name: 'Baseball', postedDate: '02/05/16', endDate: '01/06/16'},
  {category: 'Sporting Goods', price: '$29.99', stocked: false, name: 'Basketball', postedDate: '03/05/16', endDate: '01/06/16'},
  {category: 'Electronics', price: '$99.99', stocked: true, name: 'iPod Touch', postedDate: '04/05/16', endDate: '01/06/16'},
  {category: 'Electronics', price: '$399.99', stocked: false, name: 'iPhone 5', postedDate: '05/05/16', endDate: '01/06/16'},
  {category: 'Electronics', price: '$199.99', stocked: true, name: 'Nexus 7', postedDate: '06/05/16', endDate: '01/06/16'}
];

ReactDOM.render(
  <FilterableProductTable products={PRODUCTS} />,
  document.getElementById('container')
);
