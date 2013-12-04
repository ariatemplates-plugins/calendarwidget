# Calendar widget #

The **calendar widget** is a plugin for [Aria Templates](http://ariatemplates.com/ "Aria Templates").

- A demo is available at [http://ariatemplates.com/plugins/calendarwidget] (http://ariatemplates.com/plugins/calendarwidget)

- Documentation can be found in the [Calendar Widget Plugin blog article.](http://ariatemplates.com/blog/2013/12/calendar-widget-plugin/ "Calendar Widget Plugin blog article.")

When using the demo, simply hold down `Ctrl + click` to drag out a new event.

## Usage ##

To use it, there is a set a scripts that are available after the usual *npm install*:
 - *npm run-script lint* : runs JShint, verifies lowercase and checks file indentation
 - *npm run-script build* : packages the plugin with [atpackager](https://github.com/ariatemplates/atpackager "atpackager") putting the results in the build/output folder
 - *npm run-script test* : runs all unit tests in PhantomJS with [attester](http://attester.ariatemplates.com "attester")
 - *npm run-script start* : starts [attester](http://attester.ariatemplates.com "attester") and waits for real browsers to connect
 - *npm run-script sample* : starts a webserver to run the samples (at <http://localhost:8080/> or <http://localhost:8080/index.html?devMode=true> )


## Documentation ##

The calendar widget displays time events from a data store.  There are two views, which are column based, containing a backdrop for plotting the events against a day or a week.  The calendar is a template based widget which can be loaded as a widget library by any template using the following syntax:

    {Template {
        $classpath : 'app.SampleTemplate',
        $wlibs : {
            'sample' : 'atplugins.calendarwidget.CalendarWidgetLib',
    },  

To pass data into the calendar when it is first initialized, you will first need to create a module controller which extends the calendars module controller.  Here is an example of what your module controller may contain:

     /**
     * Custom module controller, created by the user 
     * and passed into the Calendar widget 
     * through the module controller property.
     */
    Aria.classDefinition({
        $classpath : "app.SampleModuleController",
        $extends : "atplugins.calendarwidget.controllers.CalendarController",
        $prototype : {
            init : function (data) {
               var event1 = new Date();
               this._data = data;
               this.json.inject({
                   events : [{
                       start : new Date(event1.setDate(event1.getDate() + 7)),
                       end : new Date(event1.setDate(event1.getDate() + 2)),
                       title : "3 day event",
                       all_day : true                        
                   }]
               }, data);
               this.$CalendarController.init.apply(this, arguments);
            },
        }
    });

And finally, from your template, an instance of the calendar can then be created with a data model injected into it (*using your module controller reference*):

    {@sample:Calendar{
        moduleCtrl : {
            classpath : "app.SampleModuleController",
            initArgs : this.data.calendarData
        }
    }/}

And that's it, feel free to look through the source code of ``app.SampleModuleController`` to understand more about how to interact with the calendar properties and events, you can also find more documentation in the [Calendar Widget Plugin blog article.](http://ariatemplates.com/blog/2013/12/calendar-widget-plugin/ "Calendar Widget Plugin blog article.")

Enjoy!



