import React, { Component } from 'react'

import {db} from '../firebase.js'
import Paper from '@material-ui/core/Paper';
import { ViewState ,EditingState,GroupingState, IntegratedGrouping,} from '@devexpress/dx-react-scheduler';
import { green, orange } from '@material-ui/core/colors';
import { makeStyles, fade } from '@material-ui/core/styles';

import {
  Scheduler,
  DayView,
  WeekView,
  MonthView,
  Appointments,
  AppointmentTooltip,
  Toolbar,
  ViewSwitcher,
  EditRecurrenceMenu,
  DateNavigator,
  TodayButton,
  AppointmentForm,
  AllDayPanel,
  ConfirmationDialog,
  Resources,
  GroupingPanel,
} from '@devexpress/dx-react-scheduler-material-ui';


import LowPriority from '@material-ui/icons/LowPriority';
import PriorityHigh from '@material-ui/icons/PriorityHigh';




const priorityData = [
  { text: 'Low Priority', id: 1, color: green },
  { text: 'High Priority', id: 2, color: orange },
];


const indiaTime = date => new Date(date).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });


const findColorByGroupId = id => (priorityData.find(item => item.id === id)).color;

const getIconById = id => (id === 1 ? LowPriority : PriorityHigh);


const useGroupingStyles = (group) => {
  const color = findColorByGroupId(group.id);
  return makeStyles(({ spacing }) => ({
    cell: {
      backgroundColor: fade(color[400], 0.1),
      '&:hover': {
        backgroundColor: fade(color[400], 0.15),
      },
      '&:focus': {
        backgroundColor: fade(color[400], 0.2),
      },
    },
    headerCell: {
      backgroundColor: fade(color[400], 0.1),
      '&:hover': {
        backgroundColor: fade(color[400], 0.1),
      },
      '&:focus': {
        backgroundColor: fade(color[400], 0.1),
      },
    },
    icon: {
      paddingLeft: spacing(1),
      verticalAlign: 'middle',
    },
  }))();
};

const TimeTableCell = React.memo(({ groupingInfo, ...restProps }) => {
  const classes = useGroupingStyles(groupingInfo[0]);
  return (
    <DayView.TimeTableCell
      className={classes.cell}
      groupingInfo={groupingInfo}
      {...restProps}
    />
  );
});


const DayScaleCell = React.memo(({ groupingInfo, ...restProps }) => {
  const classes = useGroupingStyles(groupingInfo[0]);
  return (
    <DayView.DayScaleCell
      className={classes.headerCell}
      groupingInfo={groupingInfo}
      {...restProps}
    />
  );
});

const AllDayCell = React.memo(({ groupingInfo, ...restProps }) => {
  const classes = useGroupingStyles(groupingInfo[0]);
  return (
    <AllDayPanel.Cell
      className={classes.cell}
      groupingInfo={groupingInfo}
      {...restProps}
    />
  );
});

const GroupingPanelCell = React.memo(({ group, ...restProps }) => {
  const classes = useGroupingStyles(group);
  const Icon = getIconById(group.id);
  return (
    <GroupingPanel.Cell
      className={classes.headerCell}
      group={group}
      {...restProps}
    >
      <Icon
        className={classes.icon}
      />
    </GroupingPanel.Cell>
  );
});




export class Calender extends Component {
    constructor(props){
        super(props);

        this.state={
            events:[],
            currentDate:'2020-11-02',
            currentViewName:'work-week',
            addedAppointment: {},
            appointmentChanges: {},
            editingAppointment: undefined,
            resources: [{
              fieldName: 'priorityId',
              title: 'Priority',
              instances: priorityData,
            }],
            grouping: [{
              resourceName: 'priorityId',
            }],
            name:null,
            details:null,
            start:null,
            end:null,
            
            currentlyEditing:null,
            selectedElement:null,
            selectedOpen:false,
           
            appointmentMeta: {
              target: null,
              data: {},
            },
            dialogue:false,
        };
        this.currentDateCange=(currentDate)=>{
            this.setState({currentDate});
        }
        this.currentViewNameChange=(currentViewName)=>{
            this.setState({currentViewName})
        }
        this.commitChanges = this.commitChanges.bind(this);
        this.changeAddedAppointment = this.changeAddedAppointment.bind(this);
        this.changeAppointmentChanges = this.changeAppointmentChanges.bind(this);
        this.changeEditingAppointment = this.changeEditingAppointment.bind(this);
        this.onAppointmentMetaChange = ({ data, target }) => {
          this.setState({ appointmentMeta: { data, target } });
        };
        
        
       
    }
     componentDidMount(){
      console.log("Hii");
        this.getEvents();
       
       
    }

   
    async getEvents(){
     
        const snapshot = await db.collection('Event').get();
        let events=[];
snapshot.forEach((doc) => {
  let appData=doc.data();
  appData.id=doc.id;
  events.push(appData);
 
});
this.setState({events})

console.log(events);
    }
    async updateEvent(ev){
        await db.collection('Event').doc(ev.id).set(ev)
        
         //console.log(ev);

    }


    async deleteEvent(ev){
      await db.collection('Event').doc(ev).delete();

    }

    
    
   
    changeAddedAppointment(addedAppointment) {
        this.setState({ addedAppointment });
      }
    
      changeAppointmentChanges(appointmentChanges) {
        this.setState({ appointmentChanges });
        this.setState({})
      }
    
      changeEditingAppointment(editingAppointment) {
        this.setState({ editingAppointment });
      }
      mapAppointmentData (appointment) {
      
       
        appointment.startDate= indiaTime(appointment.startDate)
        appointment.endDate= indiaTime(appointment.endDate)
        
      }
      

      commitChanges({ added, changed, deleted }) {
        this.setState((state) => {
          let { events } = state;
          if (added) {
            const startingAddedId = events.length > 0 ? events[events.length - 1].id + 1 : 0;
            events = [...events, { id: startingAddedId, ...added }];
            let ev;
            events.forEach((doc)=>{
              let appid=doc.id;
              if(appid===startingAddedId)
              {
                ev=doc;
              }
            })
            
            this.mapAppointmentData(ev);
            console.log(ev)
            this.updateEvent(ev);
            
               
          }
          if (changed) {
           // console.log(changed.title);
          
            events = events.map(appointment => (
              changed[appointment.id] ? { ...appointment, ...changed[appointment.id] } : appointment));
              let ev;
              events.forEach((doc)=>{
                let appid=doc.id;
                if(changed[appid])
                {
                  ev=doc;
                }
              })
            this.mapAppointmentData(ev);
            
             
              console.log(ev);
              this.updateEvent(ev);
          }
          if (deleted !== undefined) {
            events = events.filter(appointment => appointment.id !== deleted);
           
           this.deleteEvent(deleted);
          }
          return { events};
        });
      }
    


    render() {
        const{events,currentDate,currentViewName,addedAppointment, appointmentChanges, editingAppointment,appointmentMeta,resources, grouping}=this.state
        return (
    
            <Paper>
            <Scheduler
              //data={schedulerData}
              data={events}
              height={660}
            >
              <ViewState
                currentDate={currentDate}
                onCurrentDateChange={this.currentDateCange}
                currentViewName={currentViewName}
                onCurrentViewNameChange={this.currentViewNameChange}
                 
              />
               <GroupingState
            grouping={grouping}
          />

              <EditingState
            onCommitChanges={this.commitChanges}
             
            addedAppointment={addedAppointment}
            onAddedAppointmentChange={this.changeAddedAppointment}

            appointmentChanges={appointmentChanges}
            onAppointmentChangesChange={this.changeAppointmentChanges}

            editingAppointment={editingAppointment}
            onEditingAppointmentChange={this.changeEditingAppointment}
          />
              <DayView
                startDayHour={9}
                endDayHour={24}
                intervalCount={3}
            timeTableCellComponent={TimeTableCell}
            dayScaleCellComponent={DayScaleCell}
              />
              <WeekView
                startDayHour={10}
                endDayHour={24}
              />
               <WeekView
            name="work-week"
            displayName="Work Week"
            excludedDays={[0, 6]}
            startDayHour={9}
            endDayHour={24}
          />
              <MonthView/>
    
              <Toolbar />
              <DateNavigator/>
              <TodayButton/>
              <ViewSwitcher />
              <AllDayPanel />
              <EditRecurrenceMenu /> 
               <ConfirmationDialog /> 
              <Appointments />
              <AllDayPanel
            cellComponent={AllDayCell}
          />

<Resources
            data={resources}
            mainResourceName="priorityId"
          />
           <IntegratedGrouping />
           <GroupingPanel
            cellComponent={GroupingPanelCell}
          />
 
              <AppointmentTooltip
            showCloseButton
            showOpenButton
            appointmentMeta={appointmentMeta}
            onAppointmentMetaChange={this.onAppointmentMetaChange}
          />
           <AppointmentForm
           
           />
              

            </Scheduler>
          </Paper>
     
        )
    }
   
}

export default Calender
