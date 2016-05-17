/**
 * Created by Michael on 5/16/16.
 */

var Comment = React.createClass({
    rawMarkup: function() {
        var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
        return { __html: rawMarkup };
    },

    render: function() {
        //TODO - Temporary Fix - Should find a way to update JSON
        // File change "status='Value'" data on server
        let status = '';

        if (this.props.status == 'false'){
            status =  <span style={{color: 'blue'}}>{this.props.status}</span>
        } else {
            status =  <span style={{color: 'red'}}>{this.props.status}</span>
        }

        return (
            <tr>
                <td>{this.props.posted}</td>
                <td>{this.props.author}</td>
                <td dangerouslySetInnerHTML={this.rawMarkup()}>{this.props.text}</td>
                <td>{this.props.start}</td>
                <td>{this.props.end}</td>
                <td>{status}</td>

                <td><input
                    type="checkbox"
                    ref="inStockOnlyInput"
                    onChange={this.handleChange}
                /></td>
            </tr>
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
                Only show Overdue Promotions


            </div>
        );
    }
});

var CommentBox = React.createClass({
    loadCommentsFromServer: function() {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },

    getInitialState: function() {
        return {
            data: [],
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

    componentDidMount: function() {
        this.loadCommentsFromServer();
        setInterval(this.loadCommentsFromServer, this.props.pollInterval);
    },
    render: function() {
        return (
            <div className="commentBox">
                <SearchBar
                    filterText={this.state.filterText}
                    inStockOnly={this.state.inStockOnly}
                    onUserInput={this.handleUserInput}
                />
                <p>
                    <CommentList
                        data={this.state.data}
                        filterText={this.state.filterText}
                        inStockOnly={this.state.inStockOnly}
                    />
                </p>
            </div>
        );
    }
});

var CommentList = React.createClass({
    render: function() {
        var commentNodes = [];
        var status = 'false';
        var date = new Date();

        this.props.data.map(function(comment) {

            if (Date.parse(comment.end)< date) {
                status = 'true';
            }

            if (comment.author.indexOf(this.props.filterText) === -1 || (status === 'false' && this.props.inStockOnly)) {
                return;
            }

            commentNodes.push(
                <Comment author={comment.author} key={comment.id} start={comment.start} end={comment.end} posted={comment.posted}
                         status = {status}>
                    {comment.text}
                </Comment>
            );
        }.bind(this));


        return (
            <div className="commentList">

                <table id="productTable">
                    <caption>Promotional List</caption>

                    <thead>
                    <tr>
                        <th>Posted Date</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>StartDate</th>
                        <th>EndDate</th>
                        <th>Overdue?</th>
                        <th>Done</th>
                    </tr>
                    </thead>

                    <tbody>{commentNodes}</tbody>
                </table>
            </div>
        );

    }
});


ReactDOM.render(
    <CommentBox url="/api/comments" pollInterval={2000} />,
    document.getElementById('container')
);
