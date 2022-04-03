import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

let daysInEachMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
let daysOfTheWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
let monthsOfTheYear = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]


// Verify
function cloneDate(date) {
    return new Date(date.getTime());
}

function Day(props) {
    return (
        <div
            className="cell day"
            next={props.next}
            on={props.on}
            onClick={props.onClick}
        >
            {props.value}
        </div>
    );
}

class Month extends React.Component {
    constructor(props) {
        super(props);
        this.today = new Date();
        this.currentMonth = this.today.getMonth();
        this.firstOfTheMonth = new Date(2022, this.today.getMonth());
        this.days = [];

        // Go to the first of the month, then move backwards until Sunday
        this.currentDate = new Date(this.firstOfTheMonth.getTime());
        while (this.currentDate.getDay() > 0) {
            this.currentDate.setDate(this.currentDate.getDate() - 1);
        }

        // Find the end of the last week containing the current month
        //
        // S   M   T   W   T   F   S*
        // 30  21  01  02  03  04  05
        this.end = new Date(
            this.today.getFullYear(),
            this.today.getMonth() + 1,
            0
        );
        this.end.setDate(this.end.getDate() + (6 - this.end.getDay()));

        // Push it
        this.state = {
            days: [],
        };
        while (this.currentDate <= this.end) {
            let next = true;
            if (this.currentDate.getMonth() !== new Date().getMonth()) {
                next = false;
            }
            if (this.currentDate < new Date()) {
                next = false;
            }

            let on = true;
            if (
                this.currentDate.getDay() == 0 ||
                this.currentDate.getDay() == 6
            ) {
                on = false;
            }

            this.state.days.push({
                date: cloneDate(this.currentDate),
                next: next,
                on: on,
            });
            this.currentDate.setDate(this.currentDate.getDate() + 1);
        }
    }

    handleClick(i) {
        let days = this.state.days.slice();
        days[i].on = !days[i].on;
        console.log(!days[i].on);
        this.setState({
            days: days,
        });
    }

    renderDate(i) {
        return (
            <Day
                key={i}
                index={i}
                value={this.state.days[i].date.getDate()}
                next={this.state.days[i].next.toString()}
                on={this.state.days[i].on.toString()}
                onClick={() => this.handleClick(i)}
            />
        );
    }

    render() {
        let dates = this.state.days.map((days, index) => {
            return this.renderDate(index);
        });

        let daysOfWeek = daysOfTheWeek.map((day) => {
            return (
                <div className="cell day-of-the-week" key={Math.random()}>
                    {day[0]}
                </div>
            );
        });

        let workdaysLeft = 0;
        this.state.days.forEach((day) => {
            if (day.next && day.on) {
                workdaysLeft++;
            }
        });
        
        let currentMonth = monthsOfTheYear[new Date().getMonth()]

        return (
            <div className="calendar">
                <div className="head">
                    <p className="month-and-date">
                        <span className="current-month">{currentMonth}</span> 
                        <span className="current-date"> {new Date().getDate()}</span>
                    </p>
                    <p className="workdays-left">{workdaysLeft} Workdays left</p>
                </div>
                
                <div className="month">
                    {daysOfWeek}
                    {dates}
                </div>
            </div>
        );
    }
}

ReactDOM.render(<Month />, document.getElementById("root"));
