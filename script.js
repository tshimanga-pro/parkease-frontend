// Shared validation logic for ParkEase forms

function validateRegistrationForm(form) {
  const errors = [];
  const driverName = form.driverName.value.trim();
  const numberPlate = form.numberPlate.value.trim();
  const vehicleModel = form.vehicleModel.value.trim();
  const vehicleColor = form.vehicleColor.value.trim();
  const arrivalTime = form.arrivalTime.value;
  const date = form.date.value;
  const phoneNumber = form.phoneNumber.value.trim();
  const ninNumber = form.ninNumber.value.trim();
  const vehicleType = form.vehicleType.value;

  if (driverName.length < 2) {
    errors.push("Driver name is required (minimum 2 characters).");
  }
  if (!numberPlate) {
    errors.push("Number plate is required.");
  }
  if (!vehicleModel) {
    errors.push("Vehicle model is required.");
  }
  if (!vehicleColor) {
    errors.push("Vehicle color is required.");
  }
  if (!arrivalTime) {
    errors.push("Arrival time is required.");
  }
  if (!date) {
    errors.push("Date is required.");
  } else {
    const selected = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selected < today) {
      errors.push("Date cannot be in the past.");
    }
  }
  if (!phoneNumber.match(/^\d{10}$/)) {
    errors.push("Phone number must be exactly 10 digits.");
  }
  if (!vehicleType) {
    errors.push("Please select a vehicle type.");
  }
  if (vehicleType === "Boda Boda") {
    if (!ninNumber) {
      errors.push("NIN number is required for boda bodas.");
    } else if (!/^[0-9]{8,10}$/.test(ninNumber)) {
      errors.push("NIN number must be between 8 and 10 digits.");
    }
  }

  return errors;
}

function validateSignOutForm(form) {
  const errors = [];
  const receiverName = form.receiverName.value.trim();
  const dashboardRole = form.dashboardRole.value.trim();
  const receiptNumber = form.receiptNumber.value.trim();
  const phoneNumber = form.phoneNumber.value.trim();
  const ninNumber = form.ninNumber.value.trim();
  const arrivalTime = form.arrivalTime.value;

  if (!receiverName) errors.push("Receiver name is required.");
  if (!dashboardRole) errors.push("Role is required.");
  if (!receiptNumber) errors.push("Receipt number is required.");
  if (!phoneNumber.match(/^\d{10}$/))
    errors.push("Phone number must be 10 digits.");
  if (!ninNumber) errors.push("NIN number is required.");
  if (!arrivalTime) errors.push("Arrival time is required.");

  return errors;
}

// attach listeners once DOM is ready
window.addEventListener("DOMContentLoaded", () => {
  const regForm = document.getElementById("registrationForm");
  if (regForm) {
    regForm.addEventListener("submit", (e) => {
      const errs = validateRegistrationForm(regForm);
      if (errs.length) {
        e.preventDefault();
        alert(errs.join("\n"));
      }
    });
  }

  const signOutForm = document.getElementById("signOutForm");
  if (signOutForm) {
    signOutForm.addEventListener("submit", (e) => {
      const errs = validateSignOutForm(signOutForm);
      if (errs.length) {
        e.preventDefault();
        alert(errs.join("\n"));
      }
    });
  }
});
