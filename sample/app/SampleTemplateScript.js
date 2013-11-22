Aria.tplScriptDefinition({
    $classpath : 'app.SampleTemplateScript',
    $prototype : {
        getTime : function () {
            var res = this.data['view:timeArray'], minutes;
            if (!res) {
                res = [];
                for (var i = 0; i < 24; i++) {
                    for (var j = 0; j < 4; j++) {
                        if (!j) {
                            minutes = "00";
                        } else if (j == 1) {
                            minutes = "15";
                        } else if (j == 2) {
                            minutes = "30";
                        } else {
                            minutes = "45";
                        }
                        res.push({
                            value : i + ":" + minutes,
                            label : i + ":" + minutes
                        });
                    }
                }
            }
            return res;
        },
        getTimeZones : function () {           
            var res = [];
            res.push({
                value : "Europe/London",
                label : "Europe/London"
            }, {
                value : "America/New_York",
                label : "America/New_York"
            }, {
                value : "Europe/Moscow",
                label : "Europe/Moscow"
            });
            return res;
        },       
        newEvent : function () {
            var fieldList = ["eventTitle", "eventStartDate", "eventEndDate"]
            var validated = this._validateFields(fieldList);
            if (validated) {
                var startTime = this.data.calendarData.eventStartTime.split(":");
                var endTime = this.data.calendarData.eventEndTime.split(":");
                var event = {
                    "all_day" : this.data.calendarData.eventAllDay,
                    "start" : new Date(this.data.calendarData.eventStartDate.setHours(parseInt(startTime[0], 10), parseInt(startTime[1], 10), 00)),
                    "end" : new Date(this.data.calendarData.eventEndDate.setHours(parseInt(endTime[0], 10), parseInt(endTime[1], 10), 00)),
                    "title" : this.data.calendarData.eventTitle
                }
                this.$json.add(this.data.calendarData.events, event);
                this.$json.setValue(this.data.calendarData, "date", this.data.calendarData.eventStartDate);
                this.$json.setValue(this.data.calendarData, "updateButtonsDisabled", true);
            }
        },
        updateEvent : function () {
            aria.templates.RefreshManager.stop();
            this.deleteEvent();
            this.newEvent();
            aria.templates.RefreshManager.resume();
        },
        deleteEvent : function () {
            aria.templates.RefreshManager.stop();
            this.$json.removeAt(this.data.calendarData.events, this.data.calendarData.events.selectedEventIndex);
            this.$json.setValue(this.data.calendarData, "updateButtonsDisabled", true);
            aria.templates.RefreshManager.resume();
        },
        _validateFields : function (fieldList) {
            var element, validated = true;
            this.$json.setValue(this.data, "newEventError", false);
            for (var i = 0; i < fieldList.length; i++) {
                this._removeFieldErrorState(fieldList[i]);
                if (this.data.calendarData[fieldList[i]] == undefined || this.data.calendarData[fieldList[i]] == '') {
                    element = this.$getElementById(fieldList[i]);
                    element.classList.setClassName(element.classList.getClassName() + " error");
                    this.$json.setValue(this.data, "newEventError", true);
                    validated = false;
                }
            }
            return validated;
        },
        _removeFieldErrorState : function (field) {
            var element = this.$getElementById(field);
            element.classList.setClassName(element.classList.getClassName().replace(" error", ""));
        },
        updateStartTime : function () {
            var negativeTimeRange = this._validateTimeUpdate();
            if (!negativeTimeRange) {
                return false;
            }
            var endHours = negativeTimeRange.endTime[0];
            var endMinutes = negativeTimeRange.endTime[1];
            var startHours = (endHours) ? endHours - 1 : endHours;
            var startMinutes = (endHours && endMinutes) ? endMinutes : "00";
            this.$json.setValue(this.data.calendarData, "eventStartTime", startHours + ":" + startMinutes);
        },
        updateEndTime : function () {
            var negativeTimeRange = this._validateTimeUpdate();
            if (!negativeTimeRange) {
                return false;
            }
            var startHours = negativeTimeRange.startTime[0];
            var startMinutes = negativeTimeRange.startTime[1];
            var endHours = (startHours === 23) ? startHours : startHours + 1;
            var endMinutes = (startMinutes === 0) ? "00" : startMinutes;
            this.$json.setValue(this.data.calendarData, "eventEndTime", endHours + ":" + endMinutes);
        },
        _checkNegativeTimeRange : function () {
            var startTime = this.data.calendarData.eventStartTime.split(":");
            var endTime = this.data.calendarData.eventEndTime.split(":");
            for (var i = 0; i < 2; i++) {
                startTime[i] = parseInt(startTime[i], 10);
                endTime[i] = parseInt(endTime[i], 10);
            }
            if (startTime[0] < endTime[0]) {
                return false;
            }
            if (startTime[0] === endTime[0] && startTime[1] < endTime[1]) {
                return false;
            }
            return {
                startTime : startTime,
                endTime : endTime
            };
        },
        _validateTimeUpdate : function () {
            if (this.data.calendarData.eventStartDate === "" || this.data.calendarData.eventEndDate === "") {
                return false;
            }
            var negativeTimeRange = this._checkNegativeTimeRange();
            var sameDate = ((this.data.calendarData.eventStartDate || this.data.calendarData.eventEndDate) == undefined || this.data.calendarData.eventStartDate.setHours(0, 0, 0, 0) === this.data.calendarData.eventEndDate.setHours(0, 0, 0, 0))
                    ? true
                    : false;
            if (negativeTimeRange === false || !sameDate) {
                return false;
            }
            return negativeTimeRange;
        }
    }
});