
google.load('current', {'packages':['corechart']});


var Chart = React.createClass({
    displayName: "Chart",
    getInitialState: function() {
        return {
            data: this.getData()
        };
    },
    render: function() {
        console.log("entering rendering");
       this.draw();
        },

    componentDidMount: function() {
        this.draw();
        setInterval(this.update, 4000);
    },
    update: function(){
        this.setState({
            data : this.getData()
        });
        this.draw();
    },
    draw: function() {
        var data = this.getData();
        var options = {
            title: 'Chart showing random data auto updating',
            vAxis: {
                viewWindow: {
                    max: 40,
                    min: 0
                }
            }
        };
        var element = document.getElementById(this.props.graphName);
        var chart = new google.visualization.LineChart(element);
        chart.draw(data, options);
    },
    getData: function() {
        return google.visualization.arrayToDataTable([
            ['Random X', 'Random Y'],
            ['1', Math.floor(Math.random() * 40) + 1],
            ['2', Math.floor(Math.random() * 40) + 1],
            ['3', Math.floor(Math.random() * 40) + 1],
            ['4', Math.floor(Math.random() * 40) + 1],
            ['5', Math.floor(Math.random() * 40) + 1],
        ]);
    }
});


ReactDOM.render(
    console.log("react render"),
    <Chart graphName="piechart"/>,
    document.getElementById('body')
);