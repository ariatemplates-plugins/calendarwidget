{Template {
	$classpath : 'app.SampleTemplate',
	$wlibs : {
		'sample' : 'atplugins.calendarwidget.CalendarWidgetLib',
		'light' : 'light.LightWidgetLib'
	},
	$css: ["app.css.SampleTemplateStyle"],
	$hasScript: true,
	$width:  {
		min: 240	
	},
	$height: {
		min: 200
	}
}}

	{macro main()}
			<!-- Control Panel Start -->
			{var leftBlockVisible = $width > 1275 && $height > 640 /}
			{if leftBlockVisible}
			<div class="calendar-control-container" style="display:inline-block; width:190px;vertical-align:top;height:${$vdim(90)}px;">
				<div class="inputsContainer">
					{@light:Calendar {
						attributes : {
							classList : ["light-calendar"]
						},
						bind : {
							value: {
								to : "date",
								inside : this.data.calendarData
							}
						}
					}/}
					<br>TimeZone:<br>
					{@aria:Select {
						sclass: "simple",
				        options: this.getTimeZones(),
				        width: 150,
				        id : "calendarTimeZone",
				        bind : {
							value : {
								to : "timeZone",
								inside : this.data.calendarData
							}	
						}
			   		}/}
					<br>Summary:<br>
					{@light:TextInput {
						attributes : {
							classList : ["light-text-input"]
						},
						id : "eventTitle",
						bind : {
							value : {
								to : "eventTitle",
								inside : this.data.calendarData
							}
						}
					}/}
					<br>Start:<br>
					{@light:DatePicker {
						attributes : {
							classList : ["light-date-picker"]
						},
						id : "eventStartDate",
						bind : {
							value : {
								to : "eventStartDate",
								inside : this.data.calendarData
							}
						}
					}/}
					{section {
		              id: "startTime",
		              bindRefreshTo: [
		                  { inside: this.data.calendarData, to: "eventAllDay" }
		              ],
		              macro: "start_time"
			        }/}
				  <br>End:<br>
				  {@light:DatePicker {
					attributes : {
						classList : ["light-date-picker"]
					},
					id : "eventEndDate",
					bind : {
						value : {
							to : "eventEndDate",
							inside : this.data.calendarData
						}
					}
				  }/}
				  {section {
		          	id: "endTime",
		          	bindRefreshTo: [
		              { inside: this.data.calendarData, to: "eventAllDay" }
		          	],
		          	macro: "end_time"
		          }/}
		          <div class="all-day-event">
				    {@aria:CheckBox {
							label: "All day event:",
							labelPos: "left",
							bind: {
								"value" : {inside : this.data.calendarData, to : "eventAllDay"}
							}
						}/}
					</div>
					{@aria:Button {
						label: "Delete",
						bind : {
						 disabled : {
						   inside : this.data.calendarData,
						   to : "updateButtonsDisabled"
						 }
						},
						onclick: {
							fn : "deleteEvent"
						}
					}/}
					{@aria:Button {
						label: "Update",
						bind : {
						 disabled : {
						   inside : this.data.calendarData,
						   to : "updateButtonsDisabled"
						 }
						},
						onclick: {
							fn : "updateEvent"
						}
					}/}
					{@aria:Button {
						label: "New",
						errorMessages: ["Please complete all fields highlighted in red."],
						bind: {
							error : {
								to: "newEventError",
								inside: data
							},
							disabled : {
							   inside : this.data.calendarData,
							   to : "lock"
							 }
						},
						onclick: {
							fn : "newEvent"
						}
					}/}
						</div>
					</div>
					{/if}
					<!-- Control Panel End -->

					<div style="position:relative; vertical-align:top;display:inline-block; width: ${ leftBlockVisible ? $hdim(10,1) : $hdim(190,1) }px; height:${$vdim(180)}px;">
						{@sample:Calendar{
							moduleCtrl : {
								classpath : "app.SampleModuleController",
								initArgs : this.data.calendarData
							}
						}/}
					</div>

	{/macro}

	{macro start_time()}
		{if (!this.data.calendarData.eventAllDay)}
			<span class="select-dropdown-icon">
					{@aria:Select {
							sclass: "simple",
			        options: this.getTime(),
			        width: 95,
			        id : "eventStartTime",
			        bind : {
								value : {
									to : "eventStartTime",
									inside : this.data.calendarData
								},
								disabled : {
									to : "eventAllDay",
									inside : this.data.calendarData
								}
							},
							onchange : {
								fn : updateEndTime
							}
			    }/}
		    </span>
		  {/if}
	{/macro}

	{macro end_time()}
		{if (!this.data.calendarData.eventAllDay)}
			<span class="select-dropdown-icon">
				{@aria:Select {
						sclass: "simple",
		        options: this.getTime(),
		        width: 95,
		        id : "eventEndTime",
		        bind : {
							value : {
								to : "eventEndTime",
								inside : this.data.calendarData
							},
							disabled : {
								to : "eventAllDay",
								inside : this.data.calendarData
							}
						},
						onchange : {
							fn : updateStartTime
						}
		    }/}
	    </span>
		{/if}
	{/macro}

{/Template}