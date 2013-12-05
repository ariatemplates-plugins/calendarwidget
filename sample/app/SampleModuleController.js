/**
 * Custom module controller, created by the user and passed into the Calendar widget through the module controller
 * property.
 */
Aria.classDefinition({
    $classpath : "app.SampleModuleController",
    $extends : "atplugins.calendarwidget.controllers.CalendarController",
    $prototype : {
        init : function (data) {
            var event1 = new Date(), event2 = new Date(), event3 = new Date(), event4 = new Date(), event5 = new Date(), event6 = new Date(), event7 = new Date(), event8 = new Date(), event9 = new Date(), event10 = new Date(), event11 = new Date(), event12 = new Date(), event13 = new Date(), event14 = new Date(), event15 = new Date(), event16 = new Date(), event17 = new Date(), event18 = new Date(), event19 = new Date(), event20 = new Date(), event21 = new Date(), event22 = new Date(), event23 = new Date();

            event6.setDate(event6.getDate() - 1);
            event7.setDate(event7.getDate() - 1);            
            event8.setDate(event8.getDate() - 1);
            event9.setDate(event9.getDate() - 1);
            event10.setDate(event10.getDate() - 1);
            event11.setDate(event11.getDate() - 1);
            event12.setDate(event12.getDate() - 1);
            event13.setDate(event13.getDate() - 1);
            event21.setDate(event21.getDate() + 1);
            event22.setDate(event22.getDate() + 2);
            event23.setDate(event23.getDate() + 1);

            this._data = data;
            this.json.inject({
                date : new Date(),
                type : 1,
                startWeekDay : 0,
                allDayExpanded : false,
                updateButtonsDisabled : true,
                eventTitle : '',
                eventStartDate : '',
                eventStartTime : '0:00',
                eventEndDate : '',
                eventEndTime : '0:00',
                timeZone : "Europe/London",
                lock : false,
                interval : 15,
                startDisplayHours: 6,
                // from 0 to 23
                startDisplayMinutes: 15,
                // from 0 to 59
                events : [{
                            start : new Date(event1.setDate(event1.getDate() + 7)),
                            end : new Date(event1.setDate(event1.getDate() + 2)),
                            title : "3 day event",
                            all_day : true,
                            timeZones : this._getTimeZones(new Date(event1.setDate(event1.getDate() - 2)),new Date(event1.setDate(event1.getDate() + 2))) 
                        }, {
                            start : new Date(event2.setDate(event2.getDate())),
                            end : new Date(event2.setDate(event2.getDate() + 1)),
                            title : "My awesome event",
                            all_day : true,
                            timeZones : this._getTimeZones(new Date(event2.setDate(event2.getDate() - 1)),new Date(event2.setDate(event2.getDate() + 1)))
                        }, {
                            start : new Date(event3.setDate(event3.getDate() + 1)),
                            end : new Date(event3.setDate(event3.getDate() + 1)),
                            title : "My second event",
                            all_day : true,
                            timeZones : this._getTimeZones(new Date(event3.setDate(event3.getDate() - 1)),new Date(event3.setDate(event3.getDate() + 1)))
                        }, {
                            start : new Date(event4.setDate(event4.getDate() + 1)),
                            end : new Date(event4.setDate(event4.getDate())),
                            title : "My fourth event",
                            all_day : true,
                            timeZones : this._getTimeZones(new Date(event4.setDate(event4.getDate())),new Date(event4.setDate(event4.getDate())))
                        }, {
                            start : new Date(event5.setDate(event5.getDate() + 1)),
                            end : new Date(event5.setDate(event5.getDate())),
                            title : "Last event",
                            all_day : true,
                            timeZones : this._getTimeZones(new Date(event5.setDate(event5.getDate())),new Date(event5.setDate(event5.getDate())))
                        }, {
                            start : new Date(event6.setHours(00, 00, 00)),
                            end : new Date(event6.setHours(5, 00, 00)),
                            title : "OVERL 1",
                            all_day : false,
                            timeZones : this._getTimeZones(new Date(event6.setHours(00, 00, 00)), new Date(event6.setHours(5, 00, 00)))     
                        }, {
                            start : new Date(event7.setHours(4, 00, 00)),
                            end : new Date(event7.setHours(6, 00, 00)),
                            title : "OVERL 2",
                            all_day : false,
                            timeZones : this._getTimeZones(new Date(event7.setHours(4, 00, 00)), new Date(event7.setHours(6, 00, 00)))                    
                        }, {
                            start : new Date(event8.setHours(5, 00, 00)),
                            end : new Date(event8.setHours(8, 00, 00)),
                            title : "OVERL 3",
                            all_day : false,
                            timeZones : this._getTimeZones(new Date(event8.setHours(5, 00, 00)), new Date(event8.setHours(8, 00, 00)))  
                        }, {
                            start : new Date(event9.setHours(6, 30, 00)),
                            end : new Date(event9.setHours(8, 30, 00)),
                            title : "OVERL 4",
                            all_day : false,
                            timeZones : this._getTimeZones(new Date(event9.setHours(6, 30, 00)), new Date(event9.setHours(8, 30, 00)))  
                        }, {
                            start : new Date(event10.setHours(7, 00, 00)),
                            end : new Date(event10.setHours(9, 00, 00)),
                            title : "OVERL 5",
                            all_day : false,
                            timeZones : this._getTimeZones(new Date(event10.setHours(7, 00, 00)), new Date(event10.setHours(9, 00, 00)))
                        }, {
                            start : new Date(event11.setHours(7, 30, 00)),
                            end : new Date(event11.setHours(8, 00, 00)),
                            title : "OVERL 5 B",
                            all_day : false,
                            timeZones : this._getTimeZones(new Date(event11.setHours(7, 30, 00)), new Date(event11.setHours(8, 00, 00)))
                        }, {
                            start : new Date(event12.setHours(8, 30, 00)),
                            end : new Date(event12.setHours(11, 00, 00)),
                            title : "OVERL 6",
                            all_day : false,
                            timeZones : this._getTimeZones(new Date(event12.setHours(8, 30, 00)), new Date(event12.setHours(11, 00, 00)))
                        }, {
                            start : new Date(event12.setHours(15, 00, 00)),
                            end : new Date(event14.setHours(1, 00, 00)),
                            title : "OVERL 7",
                            all_day : false,
                            timeZones : this._getTimeZones(new Date(event12.setHours(15, 00, 00)), new Date(event14.setHours(1, 00, 00)))
                        }, {
                            start : new Date(event15.setHours(3, 00, 00)),
                            end : new Date(event15.setHours(5, 00, 00)),
                            title : "OVERL 8",
                            all_day : false,
                            timeZones : this._getTimeZones(new Date(event15.setHours(3, 00, 00)), new Date(event15.setHours(5, 00, 00)))
                        }, {
                            start : new Date(event16.setHours(4, 00, 00)),
                            end : new Date(event16.setHours(6, 00, 00)),
                            title : "OVERL 9",
                            all_day : false,
                            timeZones : this._getTimeZones(new Date(event16.setHours(4, 00, 00)), new Date(event16.setHours(6, 00, 00)))
                        }, {
                            start : new Date(event17.setHours(6, 30, 00)),
                            end : new Date(event17.setHours(8, 30, 00)),
                            title : "OVERL 10",
                            all_day : false,
                            timeZones : this._getTimeZones(new Date(event17.setHours(6, 30, 00)), new Date(event17.setHours(8, 30, 00)))
                        }, {
                            start : new Date(event18.setHours(7, 00, 00)),
                            end : new Date(event18.setHours(9, 00, 00)),
                            title : "OVERL 11",
                            all_day : false,
                            timeZones : this._getTimeZones(new Date(event18.setHours(7, 00, 00)), new Date(event18.setHours(9, 00, 00)))
                        }, {
                            start : new Date(event19.setHours(8, 30, 00)),
                            end : new Date(event19.setHours(11, 00, 00)),
                            title : "OVERL 12",
                            all_day : false,
                            timeZones : this._getTimeZones(new Date(event19.setHours(8, 30, 00)), new Date(event19.setHours(11, 00, 00)))
                        }, {
                            start : new Date(event20.setHours(23, 00, 00)),
                            end : new Date(event20.setHours(23, 30, 00)),
                            title : "OVERL 13",
                            all_day : false,                            
                            timeZones : this._getTimeZones(new Date(event20.setHours(23, 00, 00)), new Date(event20.setHours(23, 30, 00)))
                        }, {
                            start : event21,
                            end : event21,
                            title : "all day holiday",
                            all_day : true,
                            holiday: true,
                            uneditable: true,                            
                            timeZones : this._getTimeZones(new Date(event21),new Date(event21))
                        }, {
                            start : event22,
                            end : event22,
                            title : "editable holiday",
                            all_day : true,
                            holiday: true,
                            uneditable: false,
                            timeZones : this._getTimeZones(new Date(event22),new Date(event22))
                        }, {
                            start : new Date(event23.setHours(18, 30, 00)),
                            end : new Date(event23.setHours(20, 30, 00)),
                            title : "HOLIDAY",
                            all_day : false,
                            holiday: true,
                            uneditable: true,
                            timeZones : this._getTimeZones(new Date(event23.setHours(18, 30, 00)),new Date(event23.setHours(20, 30, 00)))
                        }, {
                            start : new Date(event23.setHours(22, 00, 00)),
                            end : new Date(event23.setHours(23, 00, 00)),
                            title : "EDITABLE HOLIDAY",
                            all_day : false,
                            holiday: true,
                            uneditable: false,
                            timeZones : this._getTimeZones(new Date(event23.setHours(22, 00, 00)), new Date(event23.setHours(23, 00, 00)))
                        }]
            }, data);
            this.$CalendarController.init.apply(this, arguments);
        },
        itemClick : function (evt) {
            var className = "calItem_" + evt.order, event = evt;            
            this.$logInfo('Calendar event item:"' + className + '" has just been clicked.');           
            this._update(evt);
            this.json.setValue(this._data, 'updateButtonsDisabled', (evt.uneditable || this._data.lock) ? true : false);                    
        },
        itemDoubleClick : function (evt) {
            var className = "calItem_" + evt.order;
           this.$logInfo('Calendar event item:"' + className + '" has just been double clicked.');
        },
        gridClick : function (evt) {
            this.$logInfo('Calendar grid has just been clicked.');
        },
        gridDoubleClick : function (evt) {
            this.$logInfo('Calendar grid has just been double clicked.');
        },
        // it is triggered when an event is moving
        itemEditMove : function (evt) {
            var className = "calItem_" + evt.order;
            this.$logInfo('Calendar event item:"' + className + '" is being moved.');
        },
        // it is triggered when an event is resizing
        itemEditResize : function (evt) {
            var className = "calItem_" + evt.order;
            this.$logInfo('Calendar event item:"' + className + '" is being resized.');
        },

        itemEditBegin : function (evt) {
            var className = "calItem_" + evt.order;
            this.$logInfo('Calendar event item:"' + className + '" starts editing.');
        },

        itemEditEnd : function (evt) {
            var className = "calItem_" + evt.order;
            this.$logInfo('Calendar event item:"' + className + '" ends editing.');
        },

        change : function (evt) {
            var className = "calItem_" + evt.order, event = evt;
            this.$logInfo('Calendar event item:"' + className + '" has been changed.');
            this.json.setValue(this._data, 'updateButtonsDisabled', true);
            this._update(evt);
        },

        timeZoneChange : function () {          
            this.$logInfo('Calendar time zone has been changed to: "' + this._data.timeZone +'"');
        },

        _update : function (event) {
            this.json.setValue(this._data, 'eventTitle', event.title);
            this.json.setValue(this._data, 'eventStartDate', event.start);
            this.json.setValue(this._data, 'eventEndDate', event.end);
            this.json.setValue(this._data, 'eventStartTime', this._getTime(event.start));
            this.json.setValue(this._data, 'eventEndTime', this._getTime(event.end));
            this.json.setValue(this._data, 'eventAllDay', event.all_day);
        },

        _getTime : function (time) {
            var hours = time.getHours();
            var minutes = time.getMinutes();
            minutes = (minutes === 0) ? "00" : minutes;
            return (hours + ':' + minutes);
        },

        _getTimeZoneDateTime : function (dateObject, timeDifference) {             
            return new Date(Math.abs(dateObject.getTime() + timeDifference))            
        },

        _getTimeZones : function (start, end) {
            return [{
                    name : "Europe/London",// -/+ 0 hours
                    start : start,
                    end : end
                }, {
                    name : "America/New_York",// -6 hours
                    start : this._getTimeZoneDateTime(start, -21600000),
                    end : this._getTimeZoneDateTime(end, -21600000)
                }, {
                    name : "Europe/Moscow",// +2 hours
                    start : this._getTimeZoneDateTime(start, 7200000),
                    end : this._getTimeZoneDateTime(end, 7200000)
            }] ;
        }


    }
});