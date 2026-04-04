ParkEase is a web-based software solution designed to digitize the day-to-day operations of a public parking facility that also offers tyre clinic and battery hire services. The system supports accurate record keeping, automated fee calculation, receipt generation, and daily revenue reporting.
Frontend 

At this point, we are building a system that will allow the following transactions:

Only the Admin has access has to the Admin. dashboard, and can Manage (create or delete) users.

Only the Service Manager has the right to do the follwing transactions from his Dashboard: 
(a) Register Batteries
(b) Record transaction type: Sale or Hire Battery at a predefined price.
(c) record and make transaction on Tyre Service: Pressure, Puncture Fixing, and Valves at a predefined price.

Only the Parking Attendant is allow to access their Dashboard and execute the following transactions:
(a) Register a Vehicle upon arrival and generate a ticket
(b) Sign-out a Vehicle, capture the amount due, and print out a Receipt 
(c) Access the overview of ALL Vehicles Parked in the Parking Slot.

Against Login into the system, every user is redirected to his specific Dashboard, based on his role. (email address and password are unique).
An unauthorized user can not have access to the system.

Parking Fees are automaticaly generated, based on type and duration:

'Truck':
{ short: 2000, day: 5000, night: 10000 },
'Personal Car':{ short: 2000, day: 3000, night: 2000 },
'Taxi':
'Coaster':
'Boda-boda':
};
{ short: 2000, day: 3000, night: 2000 },
{ short: 3000, day: 4000, night: 2000 },
{ short: 1000, day: 2000, night: 2000 },





