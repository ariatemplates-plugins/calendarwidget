{Template {
    $classpath: "atplugins.calendarwidget.views.Calendar",
    $css: ["atplugins.calendarwidget.views.CalendarStyle"],
    $hasScript: true
}}

{macro main()}
    <div {id "calendar"/} class="calendar">
        <div class="sidebar"></div>
        <div {on dblclick {
              fn : this.moduleCtrl.gridDoubleClick,
              scope : this.moduleCtrl
          }/}
          {on click {
              fn : this.moduleCtrl.gridClick,
              scope : this.moduleCtrl
          }/}
          class="main-content">
            {call header_navigation()/}
            {section {
                id: "calendar-grid",
                type: "div",
                attributes: {
                    classList: ["calendar-grid"]
                },
                bindRefreshTo: [
                    { inside: data, to: "type" },
                    { inside: data, to: "range" }
                ],
                macro: "calendar_grid"
            }/}
        </div>
    </div>
{/macro}

{macro header_navigation()}
    <div class="header-nav">
        <div class="pull-left">
            <button class="btn" {on click "navigateToToday"/}>Today</button>
            <div class="btn-group">
                <button class="btn" {on click "navigatePrevious"/}>&laquo;</button>
                <button class="btn" {on click "navigateNext"/}>&raquo;</button>
            </div>
            {section {
                id: "date",
                bindRefreshTo: [
                    { inside: data, to: "date" },
                    { inside: data, to: "type" }
                ],
                macro: "header_date"
            }/}
        </div>
        {section {
            id: "type",
            type: "div",
            attributes: {
                classList: ["btn-group", "pull-right"]
            },
            macro: "calendar_type_toggle",
            bindRefreshTo: [
                { inside: data, to: "type" }
            ],
            on: {
                click: { fn: "toggleType", scope: this }
            }
        }/}
    </div>
{/macro}

{macro calendar_grid()}
   {section {
        id: "calendar-header",
        type: "table",
        attributes: {
            "cellpadding": 0,
            "cellspacing": 0,
            classList: ["calendar-header"]
        },
        macro: {
            name: "calendar_header_" + TYPES[data.type]
        }
    }/}
    {section {
        id: "calendar-wrapper",
        type: "div",
        attributes: {
            classList: ["calendar-wrapper", "calendar-wrapper-"+TYPES[data.type]]
        },
        macro: {
            name: "calendar_wrapper_" + TYPES[data.type]
        },
        on: {
            'mousewheel': { fn: "onScroll", scope: this }
        }
    }/}
{/macro}


{macro header_date()}
    {if (this.data.type === 2)}
        ${data.date|dateformat:"MMMM yyyy"}
    {elseif (this.data.type === 1)/}
        Week ${getWeek()}/52
    {/if}
{/macro}

{macro calendar_type_toggle()}
    <button data-type="0" class="btn {if this.data.type === 0}active{/if}">Day</button>
    <button data-type="1" class="btn {if this.data.type === 1}active{/if}">Week</button>
{/macro}

{macro calendar_header_day()}
    <thead class="header-day">
        <tr>
            <th class="hours" scope="col"></th>
            <th scope="col">${data.date|dateformat:"EEE MMMM d, yyyy"}</th>
            <th class="dummy-th"></th>
        </tr>
    </thead>
{/macro}

{macro calendar_header_week()}
    <thead class="header-week">
        <tr>
            <th class="hours" scope="col"></th>
            {foreach day inArray data.range.slice(0, 9)}
                <th class="day_${day_index} {if isToday(day)}today{/if} {if isWeekEnd(day)}weekend{/if}" scope="col">
                    <div class="date">${day|dateformat:"d"}</div>
                    <div class="day">${weekDays[day.getDay()]}</div>
                    <div class="month">${day|dateformat:"MMM yyyy"}</div>
                </th>
            {/foreach}
            <th class="dummy-th"></th>
        </tr>
    </thead>
{/macro}

{macro calendar_header_month()}
    <thead class="header-month">
        <tr>
        {foreach day inArray data.range.slice(0, 7)}
            <th class="day day_${day_index}" scope="col">${weekDays[day.getDay()]}</th>
        {/foreach}
        </tr>
    </thead>
{/macro}

{macro calendar_wrapper_day()}
    {call grid()/}
{/macro}

{macro calendar_wrapper_week()}
    {call grid()/}
{/macro}


{macro grid()}
    {section {
        id : "all_daySection",
        macro : "all_day",
        bindRefreshTo : [{
            to : "allDayExpanded",
            inside : data,
            recursive : true
        },{
            to : "events",
            inside : data,
            recursive : true
        }]
    }/}

    <div class="timetable" style="top: ${viewData.allDayRows*22}px;" data-scrollable="true">
        <table class="{if (data.range.length === 1)}day{else/}week{/if}" cellpadding="0" cellspacing="0">
            <tbody>
            {for var i=0; i<24; i++}
                {for var j=0; j<2; j++}
                    <tr>
                        <th class="hours" scope="row">
                            <div>{if (j == 0)}${i|pad:2, true}:00{else/}&nbsp;{/if}</div>
                            <div>&nbsp;</div>
                        </th>
                        {foreach day inArray data.range}
                        <td class="{if isToday(day)}today{/if} {if isWeekEnd(day)}weekend{/if} {if !isWorkHour(i+1)}no-work{/if} {if (j == 0)}hourStart{/if}">
                            <div></div>
                            <div class="dash"></div>
                        </td>
                        {/foreach}
                    </tr>
                {/for}
            {/for}
            </tbody>
        </table>

        {section {
            id : "itemsSection",
            macro : {
                name : "items",
                args : [false]
            },
            bindRefreshTo : [{
                to : "events",
                inside : data,
                recursive : true
            }],
            attributes : {
              "classList" : [
                 "timetableSpan"
              ]
            }
        }/}

        {section {
            id : "modificationLayer",
            macro : {
                name : "items",
                args : [true]
            },
            bindRefreshTo : [{
                to : "modifyingEvents",
                inside : viewData,
                recursive : true
            }],
            attributes : {
              "classList" : [
                 "timetableSpan"
              ]
            }
        }/}

    </div>

{/macro}


{macro items(isModificationLayer)}
    {var events = calculateEventsForColumns(isModificationLayer)/}

    <table {if isModificationLayer && viewData.modifyingEvents.length == 0} style="display:none"{/if} class="{if (data.range.length === 1)}day-items{else/}week-items{/if} calendar-items-outer" cellpadding="0" cellspacing="0">
        <tbody>
            <tr>
                <th class="hours" scope="row">
                </th>
                {foreach column inArray events}
                    {var columnId = "column_" + column_index/}
                    <td
                        {if !isModificationLayer && !data.lock}
                            {on mousedown {
                                fn : this.mousedown,
                                scope : this,
                                args : {column: column_index, isAllDay: false, isColumn: true}
                            }/}
                        {/if}
                        data-class="calendar-column-outer" data-id="${column_index}">
                        {if !isModificationLayer && (isToday(data.range[column_index]))}
                            <div class="currentTimeLine" {id "currentTimeLine"/} style="top : ${getCurrentTimePosition()}px"></div>
                        {/if}
                        <div class="calendar-column" {if !isModificationLayer} {id 'column_' + column_index/} {/if}>
                            {foreach event inArray column}
                                {var className = this.$getId((isModificationLayer ? "modifyingCalendarItem" : ("calItem_" + event.event.order)))/}
                                <div
                                {if (!isModificationLayer)}
                                    {on mouseover {
                                        fn : this.itemHighlight,
                                        scope : this,
                                        args : { className : className }
                                    }/}
                                    {on mouseout {
                                        fn : this.itemUnhighlight,
                                        scope : this,
                                        args : { className : className }
                                    }/}
                                    {on click {
                                        fn : this.itemClick,
                                        scope : this,
                                        args : { data : event }
                                    }/}
                                    {on dblclick {
                                        fn : this.itemDoubleClick,
                                        scope : this,
                                        args : { data : event }
                                    }/}
                                    {if (!data.lock && !event.event.uneditable)}
                                        {on mousedown {
                                            fn : this.mousedown,
                                            scope : this,
                                            args : {column: column_index, order: event.event.order}
                                        }/}
                                    {/if}
                                {/if}
                                    data-column="${column_index}" data-index="${event_index}" data-className="${className}" class="calendar-item ${className} {if !event.hasResizeTop}eventContinuation {/if}{if event.event.holiday}holiday {/if}{if !data.lock && !event.event.uneditable}movable {/if}${isModificationLayer? "moving" : _selected(event.id)}" style="z-index : ${isModificationLayer? 1000 : event.pos}; left : ${event.left}%; width : ${event.width}%; top : ${event.top}px; height : ${event.height}px;">
                                {if !isModificationLayer && !data.lock && !event.event.uneditable && event.hasResizeTop}
                                    <div class="resize-top"
                                        {on mousedown {
                                            fn : this.mousedown,
                                            scope : this,
                                            args : { isResize: true, resizeTop : true, column: column_index, order: event.event.order }
                                        }/}
                                    ></div>
                                {/if}
                                {if (event.showTimeHeader)}
                                    <div class="calendar-item-header">
                                        ${getFormattedTime(event.event.start)}
                                    </div>
                                {/if}
                                {if (event.showEndTime && isModificationLayer)}
                                    <div class="calendar-item-footer">
                                        ${getFormattedTime(event.event.end)}
                                    </div>
                                {/if}
                                <span class="event-title">
                                    ${event.event.title}
                                </span>
                                {if (!isModificationLayer && !data.lock && !event.event.uneditable)}
                                    <div class="resize-bottom"
                                        {on mousedown {
                                            fn : this.mousedown,
                                            scope : this,
                                            args : { isResize: true, resizeTop : false, column: column_index, order: event.event.order }
                                        }/}
                                    ></div>
                                {/if}
                                </div>
                            {/foreach}
                        </div>
                    </td>
                {/foreach}
            </tr>
        </tbody>
    </table>
{/macro}


{macro all_day()}
    {var eventsSubset = filterAndOrderEvents(false)/}
    {var rows = getAllDayEventsRows(data.allDayExpanded, eventsSubset)/}
    <div style="position:relative; width: 100%;height: ${rows*22}px;" data-scrollable="true">
        <table class="all-day-events" cellpadding="0" cellspacing="0">
            <tbody>
                <tr>
                    <th class="hours" scope="row">
                       <div class="timezone">&nbsp;</div>
                       <div class="timezone">&nbsp;</div>
                    </th>

                    {foreach day inArray data.range}
                        <td>
                            <div>&nbsp;</div>
                            <div>&nbsp;</div>
                        </td>
                    {/foreach}

                    <td class="dummy-td"></td>
                </tr>
            </tbody>
        </table>

        {section {
            id : "itemsAllDaySection",
            macro : {
                name : "itemsAllDay",
                args : [false, data.allDayExpanded, eventsSubset]
            },
            attributes: {
                  classList: ["all-day-section"]
             },
            bindRefreshTo : [{
                to : "events",
                inside : data,
                recursive : true
            }]
        }/}

        {section {
            id : "allDayModificationLayer",
            macro : {
                name : "itemsAllDay",
                args : [true, data.allDayExpanded]
            },
            bindRefreshTo : [{
                to : "modifyingAllDayEvents",
                inside : viewData,
                recursive : true
            }]
        }/}

    </div>
{/macro}



{macro itemsAllDay(isModificationLayer, expanded, eventsSub)}
    {var eventsSubset = isModificationLayer? filterAndOrderEvents(true) : filterAndOrderEvents(false)/}

    <table {if isModificationLayer && viewData.modifyingAllDayEvents.length == 0} style="display:none"{/if} class="all-day-events {if isModificationLayer}modLayer{/if} itemsContainer" cellpadding="0" cellspacing="0">
        <tbody>
            <tr>
                <th class="hours" scope="row">
                   <div class="timezone">${getTimezone()}</div>
                </th>

                {foreach day inArray data.range}
                    <td
                        {if !isModificationLayer && !data.lock}
                            {on mousedown {
                                fn : this.mousedown,
                                scope : this,
                                args : {column: day_index, isAllDay: true, isColumn: true}
                            }/}
                        {/if}
                        data-class="calendar-column-outer" data-id="${day_index}">
                        <div style="height: 100%; width: 100%; position: relative; top: 0px;">

                            {var events = eventsSubset[day_index]/}
                            {var day_date = data.range[day_index]/}
                            {var allDayNum = 0/}
                            {for var i = 0, len = events.length; i < len; i++}
                                {if events[i] && events[i].event}
                                    {if i < 1 || expanded}
                                          {var className = this.$getId((isModificationLayer ? "modifyingAllDayCalendarItem" : ("calItem_" + events[i].event.order)))/}
                                          {var firstClass = (events[i].meta.first_day || data.type == 0) ? "first" : ""/}
                                          {var lastClass = (events[i].meta.last_day || data.type == 0) ? "last" : ""/}
                                          {var eventIndex = events[i].event.order/}
                                          <div
                                          {if (!isModificationLayer)}
                                              {on mouseover {
                                                  fn : this.itemHighlight,
                                                  scope : this,
                                                  args : { className : className }
                                              }/}
                                              {on mouseout {
                                                  fn : this.itemUnhighlight,
                                                  scope : this,
                                                  args : { className : className }
                                              }/}
                                              {on click {
                                                  fn : this.itemClick,
                                                  scope : this,
                                                  args : { data : events[i] }
                                              }/}
                                              {on dblclick {
                                                    fn : this.itemDoubleClick,
                                                    scope : this,
                                                    args : { data : events[i] }
                                              }/}
                                              {if (!data.lock && !events[i].event.uneditable)}
                                                  {on mousedown {
                                                      fn : this.mousedown,
                                                      scope : this,
                                                      args : {column: day_index, order: eventIndex, isAllDay: true}
                                                  }/}
                                              {/if}
                                            {/if}
                                            class="calendar-all-day-item ${firstClass} ${lastClass} ${className} ${_selected(eventIndex)}" style="position: absolute; top:${i*22}px; width:100%;">
                                            <div class="event{if !data.lock && !events[i].event.uneditable} movable{/if}{if events[i].event.holiday} holiday{/if}">
                                                  {if events[i].meta.first_day && data.type != 0 && !data.lock && !events[i].event.uneditable}
                                                      <div
                                                        {if (!isModificationLayer)}
                                                            {on mousedown {
                                                                fn : this.mousedown,
                                                                scope : this,
                                                                args : { isAllDay: true, isResize: true, resizeTop : true, column: day_index, order: events[i].event.order }
                                                            }/}
                                                        {/if} class="resize-left"></div>
                                                  {/if}
                                                  <div class="title">{if events[i].meta.first_day || data.type == 0} ${events[i].event.title} {/if}&nbsp;</div>
                                                  {if events[i].meta.last_day && data.type != 0 && !data.lock && !events[i].event.uneditable}
                                                      <div
                                                        {if (!isModificationLayer)}
                                                            {on mousedown {
                                                                fn : this.mousedown,
                                                                scope : this,
                                                                args : { isAllDay: true, isResize: true, resizeTop : false, column: day_index, order: events[i].event.order }
                                                            }/}
                                                        {/if}  class="resize-right"></div>
                                                  {/if}
                                              </div>
                                          </div>
                                    {/if}
                                    {if i > 0}
                                        {set allDayNum = allDayNum + 1/}
                                    {/if}
                                {/if}
                            {/for}

                            {if allDayNum > 0 }
                                <div {on click "toggleExpand"/} class="title" style="text-align: center; position: absolute; top:${expanded? (22 * events.length) : 22}px; width:100%;">
                                    <span class="expandAllDay">
                                        {if expanded}
                                              &#9650
                                        {else/}
                                            +${allDayNum}&nbsp;  &#9660
                                        {/if}
                                    </span>
                                </div>
                            {/if}
                        </div>
                    </td>
                {/foreach}

                <td class="dummy-td"></td>

            </tr>
        </tbody>
    </table>

{/macro}

{/Template}