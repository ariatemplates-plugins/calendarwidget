Aria.tplScriptDefinition({
    $classpath : "atplugins.calendarwidget.views.CalendarScript",
    $constructor : function () {
        this.weekDays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
        this.selected = null;
        this.TABLE_HEIGHT = 2016;
        this.tmpItems = {};
        this.viewData = {};
    },
    $destructor : function () {
        aria.core.Timer.cancelCallback(this.idTimeoutRefreshLine);
    },
    $statics : {
        TYPES : ["day", "week"]
    },
    $prototype : {

        onModuleEvent : function (evt) {
            if (evt.name == "dateModelChange") {
                this.__update(this.data.type, this.data.date);
            }

            if (evt.name == "eventsModelChange") {
                this.data.events.selectedEventIndex = '';
                this.$refresh();
            }

            if (evt.name == "timeZoneChange") {
                this.data.events.selectedEventIndex = '';
                this.updateEvents();
                this.moduleCtrl.timeZoneChange();
            }

        },
        $displayReady : function () {
            if(this.idTimeoutRefreshLine === undefined){
                this.__startRefreshTask();
            }
        },

        $dataReady : function () {
            this.viewData.modifyingEvents = [];
            this.viewData.modifyingAllDayEvents = [];
            this.data.startWeekDay = this.data.startWeekDay || 0;
            this.data.highlightWeekEnd = this.data.highlightWeekEnd || false;
            this.data.workHours = this.data.workHours || [0, 24];
            this.data.interval = this.data.interval || 15;
            this.data._numberOfIncrements = 60 / this.data.interval;
            this.STEP = this.TABLE_HEIGHT / 24 / this.data._numberOfIncrements;
            this.__normalizeEventsDates();
            this.__update(this.data.type, this.data.date);
        },

        $beforeRefresh: function (par) {
            if(aria.utils.Array.indexOf(["itemsSection", "calendar-wrapper", "calendar-grid"], par.outputSection) > -1 || par.outputSection === undefined){
                var items = Aria.$window.document.querySelectorAll('#' + this.$getId("calendar") + ' div.timetable');
                if(items.length !== 0){
                    this.lastTimetableScroll = items[0].scrollTop;
                }
            }
        },

        $afterRefresh: function (par) {
            var container=aria.utils.Dom.getElementById(this.$getId("calendar"));
            container.onselectstart = Aria.returnFalse;

            if(par && par.outputSection == "all_daySection"){
                this.setTimetableTopOffset();
            }
            if(!par || par.outputSection === undefined || aria.utils.Array.indexOf(["itemsSection", "calendar-wrapper", "calendar-grid"], par.outputSection) > -1){
                this.__restoreTimetableScroll();
            }
        },

        __normalizeEventsDates : function () {
            for(var i = 0, l = this.data.events.length; i < l; i++){
                var evt = this.data.events[i];
                evt.originalStart = evt.start;
                evt.originalEnd = evt.end;
                evt.start = this.__getClosestDateStep(evt.start);
                evt.end = this.__getClosestDateStep(evt.end);
            }
        },

        __startRefreshTask : function () {
            if(this.idTimeoutRefreshLine !== undefined){
                this.__refreshCurrentTimeLine();
            }
            this.idTimeoutRefreshLine = aria.core.Timer.addCallback({
                fn : this.__startRefreshTask,
                scope : this,
                delay : 1000 * 60 * 5
            });
        },

        __refreshCurrentTimeLine : function () {

            var parent, parentWrapper, col, notSameDay;
            var line = aria.utils.Dom.getElementById(this.$getId("currentTimeLine"));
            var ix = this.getTodayColumn();

            if(line){
                parent = line.parentNode, parentWrapper = new aria.templates.DomElementWrapper(parent);
                col = parentWrapper.getData("id");
                notSameDay = !this.isToday(this.data.range[col]);
                // if line column should change
                if(notSameDay){
                    parent.removeChild(line);
                }
            }
            var changeColumn = (!line && ix != null) || (line && notSameDay);
            if(ix !== undefined){
                if(!line){
                    line = Aria.$window.document.createElement("div");
                    line.className = "currentTimeLine";
                    line.id = this.$getId('currentTimeLine');
                }
                if(changeColumn){
                    var todayCol = aria.utils.Dom.getElementById(this.$getId("column_" + ix));
                    todayCol.parentNode.insertBefore(line, todayCol);
                }
                var top = this.getCurrentTimePosition();
                line.style.top = top + "px";
            }
        },

        __getClosestDateStep : function(date){
            var newDate = new Date(date), min = date.getMinutes();
            var diff = min % this.data.interval;
            if(diff !== 0){
                if(diff > 7){
                    newDate.setMinutes(newDate.getMinutes() + this.data.interval - diff);
                }
                else{
                    newDate.setMinutes(newDate.getMinutes() - diff);
                }
            }
            newDate.setSeconds(0);
            return newDate;
        },

        getDaysInMonth : function (date) {
            var year = date.getFullYear(), month = date.getMonth();
            return (new Date(year, month + 1, 0)).getDate();
        },

        startingDayInMonth : function (date) {
            var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
            return firstDay.getDay();
        },

        navigateToToday : function (evt) {
            this.__update(this.data.type, new Date());
        },

        navigatePrevious : function (evt) {
            var _date = this.data.date, year = _date.getFullYear(), month = _date.getMonth(), date = _date.getDate(), _newdate;

            switch (this.data.type) {
                case 0 :
                    _newdate = new Date(year, month, date - 1);
                    break;
                case 1 :
                    _newdate = new Date(year, month, date - 7);
                    break;
            }

            this.__update(this.data.type, _newdate);
            evt.stopPropagation();
        },

        navigateNext : function (evt) {
            var _date = this.data.date, year = _date.getFullYear(), month = _date.getMonth(), date = _date.getDate(), _newdate;

            switch (this.data.type) {
                case 0 :
                    _newdate = new Date(year, month, date + 1);
                    break;
                case 1 :
                    _newdate = new Date(year, month, date + 7);
                    break;
            }

            this.__update(this.data.type, _newdate);
            evt.stopPropagation();
        },

        __update : function (type, new_date) {
            aria.utils.Json.setValue(this.data, "date", new_date);
            aria.utils.Json.setValue(this.data, "range", this.calculateDatesRange(type, new_date));
        },

        onScroll : function (evt) {
            if (this.data.type !== 2)
                return;
            if ((evt.detail || evt.wheelDelta) < 0) {
                this.navigatePrevious(evt);
            } else {
                this.navigateNext(evt);
            }
        },

        toggleExpand : function (evt) {
            aria.utils.Json.setValue(this.data, "allDayExpanded", !this.data.allDayExpanded);
        },

        toggleType : function (evt) {
            var type = parseInt(evt.target.getData("type"), 10);
            if (type === this.data.type) {
                return;
            }
            aria.utils.Json.setValue(this.data, "type", type);
            this.__update(type, this.data.date);
        },

        getWeek : function () {
            var firstDayOfYear = new Date(this.data.date.getFullYear(), 0, 1);
            return Math.ceil((((this.data.date - firstDayOfYear) / 86400000) + firstDayOfYear.getDay() + 1) / 7);
        },

        isDateMatching : function (a, b) {
            return (a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate());
        },

        isInHalfHourSlice : function (a, b) {
            return (Math.abs(b.getTime() - a.getTime()) < (30 * 60 * 1000));
        },

        isToday : function (date) {
            return this.isDateMatching(new Date(), date);
        },

        getTodayColumn : function () {
            var first = this.data.range[0];
            var today = new Date();
            var dayDiff = Math.floor((today - first) / (1000*60*60*24) );

            return ((dayDiff < this.data.range.length && dayDiff >= 0)? dayDiff : null);
        },

        isWeekEnd : function (date) {
            return date.getDay() === 0 || date.getDay() === 6;
        },

        isWorkHour : function (hour) {
            return hour >= this.data.workHours[0] && hour <= this.data.workHours[1];
        },

        getTimezone : function () {
            return this.data.timeZone.replace(/[/|_]/g, " ");
        },

        getMonthCellCssClass : function (date) {
            var cssClass = [], current = this.data.date, now = new Date();

            // We set the now date to yesterday 23:59:59
            now.setHours(0);
            now.setMinutes(0);
            now.setSeconds(0);
            now.setSeconds(-1);

            if (date.getMonth() < current.getMonth()) {
                cssClass.push("previous");
            } else if (date.getMonth() > current.getMonth()) {
                cssClass.push("next");
            } else {
                if (this.isToday(date)) {
                    cssClass.push("today");
                }
            }
            if (date < now) {
                cssClass.push("past");
            }
            if (this.data.highlightWeekEnd && this.isWeekEnd(date)) {
                cssClass.push("weekend");
            }
            return cssClass.join(" ");
        },

        getEventCellCssClass : function (date, event, meta, table_week_index) {
            var now = new Date(),
            // We set the now date to yesterday 23:59:59
            fake = (now.setHours(0) && now.setMinutes(0) && now.setSeconds(0) && now.setSeconds(-1)), cssClass = [
                    "event", "movable"], past_event = date < now, first_day = meta.first_day, last_day = meta.last_day, all_day = event.all_day;

            if (past_event) {
                cssClass.push("past");
            }
            if (first_day && (!last_day || all_day)) {
                cssClass.push("first-day");
            }
            if ((!first_day || all_day) && last_day) {
                cssClass.push("last-day");
            }

            if (!first_day && !last_day) {
                cssClass.push("ongoing-day");
            }

            if (table_week_index === 1 && !first_day) {
                cssClass.push("break-start");
            }
            if (table_week_index === 7 && !last_day) {
                cssClass.push("break-end");
            }

            return cssClass.join(" ");
        },

        calculateDatesRange : function (type, currentDate) {
            var dates = [], now = new Date(), startWeekDay = this.data.startWeekDay;

            var _calculate = function (current, start, nbOfWeeks) {
                var dates = [];
                var i = start;
                var l = (nbOfWeeks * 7) + i + (nbOfWeeks == 1 ? 2 : 0);

                for (; i < l; i++) {
                    dates.push(new Date(current.getFullYear(), current.getMonth(), i));
                }
                return dates;
            };

            if (type === 0) { // Day
                dates.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()));
            } else if (type === 1) { // Week computation
                var dayInWeek = currentDate.getDay(), day = currentDate.getDate(), start = day - dayInWeek + startWeekDay;

                dates = _calculate(currentDate, start - 1, 1);
            }
            return dates;
        },

        __getDayEvent : function (date, event) {
            var obj = {
                event : event,
                meta : {
                    first_day : this.isDateMatching(date, event.start),
                    last_day : this.isDateMatching(date, event.end)
                }
            };
            return obj;
        },

        __pushOnFirstFree : function (array, obj) {
            for (var i = 0, len = array.length; i < len; i++) {
                if (!array[i]) {
                    array[i] = obj;
                    return i;
                }
            }
            array.push(obj);
            return array.length - 1;
        },

        __sameDay : function (a, b) {
                return ((a.getDate() == b.getDate()) && (a.getMonth() == b.getMonth()) && (a.getFullYear() == b.getFullYear()));
        },

        setEventOrder : function () {
            for(var i=0, l=this.data.events.length; i<l; i++){
                this.data.events[i].order = i;
            }
        },

        updateEvents : function () {
            var events = this.data.events;
            aria.templates.RefreshManager.stop();
            for(var i=0, l=events.length; i<l; i++){
                this._updateEvent(events[i]);
            }
            aria.templates.RefreshManager.resume();
        },

        _updateEvent : function (evt) {
            var timezone;
            if (evt.timeZones === undefined) {
                this.updateEventTimeZones(evt);
            }
            for (var t=0, tl=evt.timeZones.length; t<tl; t++) {
                timezone = evt.timeZones[t];
                if (timezone.name === this.data.timeZone) {
                    aria.utils.Json.setValue(evt, "start", new Date(timezone.start));
                    aria.utils.Json.setValue(evt, "end", new Date(timezone.end));
                }
            }
        },

        _calculateTimeZoneDifference : function (evt) {
            var timezone;
            evt.timeZones = (evt.timeZones) ? evt.timeZones : [];
            for (var t=0, tl=evt.timeZones.length; t<tl; t++) {
                timezone = evt.timeZones[t];
                if (timezone.name === this.data.timeZone) {
                    return evt.start.getTime() - timezone.start.getTime();
                }
            }
            return null;
        },

        _calculateTimeZoneOffset : function () {
            var modelTimeZone = this.data.events[0].timeZones, timeZoneOffsets = [], timeZoneBase = this.data.events[0].originalStart, timezone;
            for (var t=0, tl=modelTimeZone.length; t<tl; t++) {
                timezone = modelTimeZone[t];
                timeZoneOffsets.push({
                    name : timezone.name,
                    offset : timezone.start.getTime() - timeZoneBase.getTime()
                });
            }
            return timeZoneOffsets;
        },

        updateEventTimeZones : function (evt) {
            var timezone, difference = this._calculateTimeZoneDifference(evt);
            if (difference === null) {
                // this is a new event being updated, which doesn't contain any timezone data yet.
                var timeZones = [], timeZoneOffsets = this._calculateTimeZoneOffset();
                 for (var t=0, tl=timeZoneOffsets.length; t<tl; t++) {
                    timezone = timeZoneOffsets[t];
                    timeZones.push({
                        name : timezone.name,
                        start : new Date(evt.start.getTime() + timezone.offset),
                        end : new Date(evt.end.getTime() + timezone.offset)
                    });
                 }
                 evt.timeZones = timeZones;
            } else {
                for (var t=0, tl=evt.timeZones.length; t<tl; t++) {
                    timezone = evt.timeZones[t];
                    timezone.start = new Date(timezone.start.getTime() + difference);
                    timezone.end = new Date(timezone.end.getTime() + difference);
                }
            }
        },

        calculateEventsForColumns : function (isModificationLayer) {
            var SHIFT_CONSTANT = this.data.interval;
            var self = this, _filterByRange = function (first_day, last_day) {
                return function (o) {
                    var last = new Date(last_day);
                    last.setDate(last.getDate() + 1);
                    return !o.all_day
                            && ((o.start <= last && o.end >= last) || (o.start <= first_day && o.end >= first_day) || (o.start >= first_day && o.end <= last));
                };
            }, _filterByDate = function (date) {
                return function (o) {
                    return self.isDateMatching(o.start, date) || self.isDateMatching(date, o.end)
                            && date.getTime() != o.end.getTime() || (o.start < date && o.end > date);
                };
            }, _overlaps = function (a, b) {
                return ((a.start < b.end && a.end >= b.end) || (a.start <= b.start && a.end > b.start)
                        || (a.start >= b.start && a.end <= b.end) || (a.start <= b.start && a.end >= b.end));
            }, _getDailySpot = function (day, event) {
                var dailyEnd, dailyStart = (self.__sameDay(event.start, day)) ? event.start : day;
                if (self.__sameDay(event.end, day)) {
                    dailyEnd = event.end;
                } else {
                    var end = new Date(day);
                    end.setDate(day.getDate() + 1);
                    dailyEnd = event.end;
                }
                var startPlusOneStep = new Date(event.start);
                startPlusOneStep.setMinutes(event.start.getMinutes()+SHIFT_CONSTANT);
                var start = dailyStart - day, duration = dailyEnd - dailyStart, durationInSteps = duration/(1000*60*self.data.interval);
                var top = start*self.TABLE_HEIGHT/(1000*60*60*24);
                top = ((top-1)>0)? top-1 : top;
                var height = (duration*self.TABLE_HEIGHT/(1000*60*60*24)) - 2;
                    // show the header only for the first spot of the event and only when the spot is longer than 15mins
                var showTimeHeader = self.isDateMatching(event.start, day) && durationInSteps > 1;
                var showEndTime = self.isDateMatching(event.end, day) && (durationInSteps > 2 || (durationInSteps == 2 && !showTimeHeader));
                return {
                    top : top,
                    height : height,
                    showTimeHeader : showTimeHeader,
                    showEndTime : showEndTime
                };
            }, _calculateEventPosition = function (position, numOverlaps) {
                // the following formula computes the events blocks' width so that:  20% < width <= 100%
                var width =  (80/(numOverlaps+1)) + 20;
                var shift = (numOverlaps === 0)? 0 : ((100-width)/numOverlaps);
                var left = position*shift;
                // 1% of border space
                width -= 2;
                return {
                    left : left,
                    width : width
                };
            };
            var data = this.data;
            var numOfDays = Math.round((data.range[data.range.length-1] - data.range[0]) / (24 * 3600 * 1000)) + 1;
            var evtToFilter = isModificationLayer? this.viewData.modifyingEvents : this.data.events;
            this.setEventOrder();
            var week_events = aria.utils.Array.filter(evtToFilter, _filterByRange(data.range[0], data.range[data.range.length-1]));
            var date = new Date(data.range[0]);
            var evts = [], evtIds = [];

            for (var i = 0; i < numOfDays; i++, date.setDate(date.getDate() + 1)) {
                evts.push([]);
                var rail = [];
                var day_events = aria.utils.Array.filter(week_events, _filterByDate(date));
                day_events.sort(function (a, b) {
                    return a.start - b.start;
                });
                for (var w in day_events) {
                    if (!day_events.hasOwnProperty(w)) {
                        continue;
                    }
                    var spot = _getDailySpot(date, day_events[w]);
                    var evt = {
                        event : day_events[w],
                        top : spot.top ,
                        height : spot.height,
                        pos : undefined,
                        numOverlaps : 0,
                        showTimeHeader : spot.showTimeHeader,
                        showEndTime : spot.showEndTime,
                        hasResizeTop : this.__sameDay(day_events[w].start, date)
                    };

                    for (var z = 0, len = rail.length; z < len; z++) {
                        if (rail[z].evt.event.end <= day_events[w].start) {
                            evt.pos = z;
                            break;
                        }
                    }
                    evt.pos = (evt.pos !== undefined) ? evt.pos : rail.length;
                    var conflicts = [];

                    for (var z = 0, len = rail.length; z < len; z++) {
                        if (z != evt.pos && rail[z].evt.event.end > day_events[w].start) {
                            if (!rail[z].conflicts[evt.pos]) {
                                rail[z].conflicts[evt.pos] = true;
                                rail[z].evt.numOverlaps++;
                            }
                            evt.numOverlaps++;
                            conflicts[z] = true;
                        }
                    }

                    rail[evt.pos] = {
                        evt : evt,
                        conflicts : conflicts
                    };
                    evts[i].push(evt);
                }

                for (var j = 0, len = evts[i].length; j < len; j++) {
                    var evt = evts[i][j];
                    var horizontalPosition = _calculateEventPosition(evt.pos, evt.numOverlaps);
                    evt.left = horizontalPosition.left;
                    evt.width = horizontalPosition.width;
                    var evtId = aria.utils.Array.indexOf(evtIds, evt.event);
                    if(evtId != -1){
                        evt.id = evtId;
                    }
                    else{
                        evt.id = evtIds.length;
                        evtIds.push(evt.event);
                    }
                }

            }
            if(!isModificationLayer){
                this.eventsMatrix = evts;
            }

            return evts;
        },

        filterAndOrderEvents : function (isModificationLayer) {
            var prev = [], curr = [], matching_events, orderedEvents = [], self = this, events = [], dates = this.data.range;
            var _filterByDate = function (date) {
                return function (o) {
                    return o.all_day && (self.isDateMatching(o.start, date) || self.isDateMatching(date, o.end)
                                                || (o.start < date && o.end > date));
                };
            }, _getWidth = function (event, day, numDays) {
                var evtDuration = (event.end - event.start) / (24 * 3600 * 1000) + 1;
                var maxDuration = numDays - day;
                var duration = Math.min(evtDuration, maxDuration);
                return 100 * duration;
            };

            this.setEventOrder();

            for (var i = 0, l = dates.length; i < l; i++) {
                var day_events = [], firstDayEvents = [], date = dates[i];

                var matching_events = aria.utils.Array.filter((isModificationLayer? this.viewData.modifyingAllDayEvents : this.data.events), _filterByDate(date));

                for (var j = 0, k = matching_events.length; j < k; j++) {
                    var evt = matching_events[j], wrappedEvt = {event: evt}, width, left;
                    var isFirstDay = this.isDateMatching(date, evt.start), isLastDay = this.isDateMatching(date, evt.end);

                    if (!isFirstDay) {
                        var ix = aria.utils.Array.indexOf(prev, evt);
                        width = 100;
                        left = 0;
                        if (ix != -1) {
                            day_events[ix] = wrappedEvt;
                        } else {
                            ix = this.__pushOnFirstFree(day_events, wrappedEvt);
                        }
                        curr[ix] = evt;
                    } else {
                        width = _getWidth(evt, i, l);
                        left = i * 100 / l;
                        firstDayEvents.push(wrappedEvt);
                    }

                    wrappedEvt.meta = {
                        first_day : isFirstDay,
                        last_day : isLastDay,
                        width : width,
                        left : left
                    };
                }

                for (var j = 0, k = firstDayEvents.length; j < k; j++) {
                    var evt = firstDayEvents[j];
                    var ix = this.__pushOnFirstFree(day_events, evt);
                    curr[ix] = evt.event;
                }
                prev = curr;
                events[i] = day_events;
            }

            return events;
        },

        getAllDayEventsRows : function (expanded, events) {
            var rows = 0;
            if (expanded) {
                for (var i in events) {
                     if (!events.hasOwnProperty(i)) {
                        continue;
                    }
                    var len = events[i].length;
                    if (len > rows) {
                        rows = len;
                    }
                }
            }
            rows = (rows < 2) ? 2 : (rows+1);
            this.viewData.allDayRows = rows;

            return rows;
        },

        setTimetableTopOffset : function () {
            var items = Aria.$window.document.querySelectorAll('.calendar div.timetable');
            items[0].style.top = (this.viewData.allDayRows*22) + "px";
        },

        itemHighlight : function (evt, args) {
            var items = Aria.$window.document.querySelectorAll('.' + args.className);
            this.zIndexHighlight = [];
            for(var i=0, len = items.length; i<len; i++){
                (new aria.utils.ClassList(items[i])).add("highlight");
                this.zIndexHighlight[i] = items[i].style.zIndex;
                items[i].style.zIndex = 1000;
            }
        },

        itemUnhighlight : function (evt, args) {
            var items = Aria.$window.document.querySelectorAll('.' + args.className);
            for(var i=0, len = items.length; i<len; i++){
                (new aria.utils.ClassList(items[i])).remove("highlight");
                items[i].style.zIndex = this.zIndexHighlight[i];
            }
        },

        mousedown : function (evt, args) {
            evt.stopPropagation();

            this.isAllDayModification = args.isAllDay, this.modifyingEventsName = this.isAllDayModification? "modifyingAllDayEvents" : "modifyingEvents";
            this.isItemMoving = !args.isResize;
            this.isNewItem = args.isColumn && evt.ctrlKey;
            this.resizeTop = args.resizeTop;
            this.startItemColumn = this.currentItemColumn = args.column;

            this.modEvent = (args.order === undefined)? undefined : this.data.events[args.order];
            this.currentX = evt.screenX;
            this.currentY = evt.screenY;

            if(this.isNewItem || args.order !== undefined){
                if(this.isNewItem){
                    var startDate = new Date(this.data.range[this.startItemColumn]), endDate = new Date(startDate);
                    var timetableScroll = evt.target.getParentWithData("scrollable").getScroll();

                    var c = Aria.$window.document.getElementById(this.$getId("column_" + this.startItemColumn));

                    if(!args.isAllDay){
                        var y = evt.clientY - aria.utils.Dom.getGeometry(c).y + timetableScroll.scrollTop;
                        var x = evt.clientX - aria.utils.Dom.getGeometry(c).x + timetableScroll.scrollLeft;

                        var steps = Math.floor(y/this.STEP);
                        var hours = Math.floor(steps/this.data._numberOfIncrements);
                        var minutes = (steps%this.data._numberOfIncrements)*this.data.interval;
                        startDate.setHours(hours);
                        startDate.setMinutes(minutes);
                        endDate = new Date(startDate);
                        endDate.setMinutes(endDate.getMinutes()+this.data.interval);
                    }

                    var newEvt = {
                        start : startDate,
                        end : endDate,
                        title : "NEW EVENT",
                        all_day : args.isAllDay
                    };
                    aria.utils.Json.add(this.viewData[this.modifyingEventsName], newEvt);
                    //aria.utils.Json.add(this.data.events, newEvt);
                    this.modEvent = newEvt;
                    this.isItemMoving = false;
                    this.isModificationStarted = true;
                }

            aria.utils.Event.addListener(Aria.$window.document, "mouseup", {
                fn: this.mouseup,
                scope: this
            }, true);
            aria.utils.Event.addListener(Aria.$window.document, "mousemove", {
                fn: this.mousemove,
                scope: this
            }, true);
            }
        },

        mouseup : function (evt, args) {
            aria.utils.Event.removeListener(Aria.$window.document, "mouseup", {
                fn: this.mouseup,
                scope: this
            });
            aria.utils.Event.removeListener(Aria.$window.document, "mousemove", {
                fn: this.mousemove,
                scope: this
            });

            if(this.isModificationStarted){
                this.data.events.selectedEventIndex = '';
                aria.templates.RefreshManager.stop();

                if(this.isNewItem){
                    aria.utils.Json.add(this.data.events, this.modEvent);
                }
                else{
                    aria.utils.Json.setValue(this.modEvent, "start", new Date(this.modEvent.start));
                    aria.utils.Json.setValue(this.modEvent, "end", new Date(this.modEvent.end));
                }

                aria.utils.Json.setValue(this.viewData, this.modifyingEventsName, []);
                aria.templates.RefreshManager.resume();

                this.__endModification(this.modEvent);

            }

        },

        mousemove : function (evt, args) {
            var x = evt.screenX, y = evt.screenY, diffY = y-this.currentY, diffX = x-this.currentX;
            if(Math.abs(diffY) >= this.STEP || Math.abs(diffX) >= 10){
                this.__startModification();
                if(Math.abs(diffY) >= this.STEP && !this.isAllDayModification){
                    this.updateY(diffY);
                }
                if(Math.abs(diffX) >= 10){
                    this.currentX += diffX;
                    var colId = this.getParentColumnId(aria.core.Browser.isIE? evt.srcElement : evt.target);
                    if(colId!=null && colId != this.currentItemColumn){
                        this.updateX(colId);
                    }

                }
            }
        },

        __startModification : function () {
            if(!this.isModificationStarted){
                this.moduleCtrl.itemEditBegin(this.modEvent);
                this.isModificationStarted = true;
                aria.utils.Json.add(this.viewData[this.modifyingEventsName], this.modEvent);
            }
        },

        __endModification : function (evt) {
            this.isModificationStarted = false;
            this.moduleCtrl.itemEditEnd(evt);
            this.updateEventTimeZones(evt);
            this.moduleCtrl.change(evt);
        },

        updateX : function (colId) {
            var dayDiff = colId - this.currentItemColumn;

            var evt = this.modEvent;
            var startDate = evt.start.getDate(), endDate = evt.end.getDate();

            if(this.isItemMoving){
                evt.end.setDate(endDate + dayDiff);
                evt.start.setDate(startDate + dayDiff);
                this.currentItemColumn = colId;
                this.moduleCtrl.itemEditMove(evt);
            }
            else{
                var newStart = (new Date(evt.start)).setDate(startDate+dayDiff);
                var newEnd = (new Date(evt.end)).setDate(endDate+dayDiff);
                var resizeTop = this.resizeTop && (newStart < evt.end || newStart == evt.end.getTime() && this.isAllDayModification);
                var resizeBottom = !this.resizeTop && (newEnd > evt.start || newEnd == evt.start.getTime() && this.isAllDayModification) ;

                // if new event's start is not after event end
                if(resizeTop){
                    evt.start.setDate(startDate + dayDiff);
                }
                // if new event's end is not before event start
                else {
                    if(resizeBottom){
                        evt.end.setDate(endDate + dayDiff);
                    }
                }
                if(resizeTop || resizeBottom){
                    this.currentItemColumn = colId;
                    this.moduleCtrl.itemEditResize(evt);
                }
            }
            this.$refresh({
                outputSection : this.isAllDayModification? "allDayModificationLayer" : "modificationLayer"
            });
        },

        updateY : function (diffY) {
            var steps = Math.floor(diffY / this.STEP), shift = steps * this.STEP, minuteDiff = steps * this.data.interval;

            var evt = this.modEvent;
            var startMinutes = evt.start.getMinutes(), endMinutes = evt.end.getMinutes();

            if(this.isItemMoving){
                evt.end.setMinutes(evt.end.getMinutes() + minuteDiff);
                evt.start.setMinutes(evt.start.getMinutes() + minuteDiff);
                this.currentY += shift;
                this.moduleCtrl.itemEditMove(evt);
            }
            else{
                // if new event's start is not after event end
                var resizeTop = this.resizeTop && ((new Date(evt.start)).setMinutes(startMinutes+minuteDiff) < evt.end);
                var resizeBottom = !this.resizeTop && ((new Date(evt.end)).setMinutes(endMinutes+minuteDiff) > evt.start);
                if(resizeTop){
                    evt.start.setMinutes(startMinutes+minuteDiff);
                }
                    // if new event's end is not before event start
                if(resizeBottom){
                    evt.end.setMinutes(endMinutes+minuteDiff);
                }
                if(resizeTop || resizeBottom){
                    this.currentY += shift;
                    this.moduleCtrl.itemEditResize(evt);
                }

            }

            this.$refresh({
                outputSection : "modificationLayer"
            });
        },

        __restoreTimetableScroll : function () {
            if(this.lastTimetableScroll === undefined){
                this.lastTimetableScroll = ((this.data.startDisplayHours * 60) + this.data.startDisplayMinutes) * this.TABLE_HEIGHT / (60*24);
            }
            var items = Aria.$window.document.querySelectorAll('.calendar div.timetable');
            items[0].scrollTop = this.lastTimetableScroll;
        },

        getParentColumnId : function (elem) {
            var id, tmp = elem;
            if(aria.utils.Type.isInstanceOf(elem, "Document")){
                return null;
            }
            if(!aria.utils.Type.isInstanceOf(elem, "aria.templates.DomElementWrapper")){
                tmp = new aria.templates.DomElementWrapper(elem);
            }
            tmp = tmp.getParentWithData("class");
            if(tmp){
                id = parseInt(tmp.getData("id"), 10);
            }
            return id;
        },

        getColumnWidth : function () {
            var time = new Date();
            return ((time.getHours() * 60) + time.getMinutes());
        },

        getCurrentTimePosition : function () {
            var time = new Date();
            return ((time.getHours() * 60) + time.getMinutes()) * this.TABLE_HEIGHT / (60*24);
        },

        getFormattedTime : function (date) {
            var min = date.getMinutes();
            return date.getHours() + ":" + (min < 10 ? "0" : "") + min;
        },

        itemClick : function (evt, args) {
            var unselectedClassName = this.$getId("calItem_" + this.data.events.selectedEventIndex);
            this.data.events["selectedEventIndex"] = args.data.event.order;
            var selectedClassName = this.$getId("calItem_" + this.data.events.selectedEventIndex);
            this._removeClass("selected", unselectedClassName);
            this._addClass("selected", selectedClassName);
            this.moduleCtrl.itemClick(args.data.event, args);
        },

        itemDoubleClick : function (evt, args) {
            this.moduleCtrl.itemDoubleClick(args.data.event, args);
        },

        _addClass : function (className, domElementName) {
            var items = Aria.$window.document.querySelectorAll('.' + domElementName);
            for (var i = 0, len = items.length; i < len; i++) {
                (new aria.utils.ClassList(items[i])).add(className);
            }
        },

        _removeClass : function (className, domElementName) {
            var items = Aria.$window.document.querySelectorAll('.' + domElementName);
            for (var i = 0, len = items.length; i < len; i++) {
                (new aria.utils.ClassList(items[i])).remove(className);
            }
        },

        _selected : function (id) {
            return (this.data.events.selectedEventIndex === id) ? "selected" : "";
        }

    }
});