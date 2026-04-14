(() => {
  const STORAGE_KEY = "parkEaseRegistrations";
  const SIGNOUT_STORAGE_KEY = "parkEaseSignouts";
  const RECEIPT_COUNTER_KEY = "parkEaseReceiptCounter";

  const searchQuery = document.getElementById("searchQuery");
  const searchBtn = document.getElementById("searchBtn");

  const sidebarMessage = document.getElementById("sidebarMessage");
  const sidebarDetails = document.getElementById("sidebarDetails");
  const sbDriver = document.getElementById("sbDriver");
  const sbTicket = document.getElementById("sbTicket");
  const sbPlate = document.getElementById("sbPlate");
  const sbVehicle = document.getElementById("sbVehicle");
  const sbArrival = document.getElementById("sbArrival");
  const sbDuration = document.getElementById("sbDuration");
  const sbFee = document.getElementById("sbFee");
  const sbStatus = document.getElementById("sbStatus");
  const sbSignOut = document.getElementById("sbSignOut");

  let currentEntry = null;

  function getRegistrations() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function getSignouts() {
    try {
      const raw = localStorage.getItem(SIGNOUT_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function saveSignouts(entries) {
    localStorage.setItem(SIGNOUT_STORAGE_KEY, JSON.stringify(entries));
  }

  function getReceiptCounter() {
    const raw = localStorage.getItem(RECEIPT_COUNTER_KEY);
    const value = Number(raw);
    return Number.isInteger(value) && value >= 0 ? value : 0;
  }

  function setReceiptCounter(value) {
    localStorage.setItem(RECEIPT_COUNTER_KEY, String(value));
  }

  function getNextReceiptNumber() {
    const nextNumber = getReceiptCounter() + 1;
    setReceiptCounter(nextNumber);
    return `R-${String(nextNumber).padStart(6, "0")}`;
  }

  function formatDateTime(value) {
    if (!value) return "—";
    const d = new Date(value);
    return d.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function formatDateKey(date) {
    return new Date(date).toISOString().slice(0, 10);
  }

  function formatDuration(ms) {
    const totalMinutes = Math.floor(ms / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  }

  function printPaymentReceipt(entry) {
    const receiptHtml = `<!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>ParkEase Payment Receipt</title>
          <style>
            body { font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; padding: 22px; color: #0f172a; }
            h1 { margin-top: 0; font-size: 1.6rem; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; }
            th, td { padding: 10px 12px; border: 1px solid #d1d5db; text-align: left; }
            th { background: #f3f4f6; }
            .note { margin-top: 20px; font-size: 0.95rem; color: #374151; }
          </style>
        </head>
        <body>
          <h1>ParkEase Payment Receipt</h1>
          <p><strong>Receipt #:</strong> ${entry.receiptNumber}</p>
          <p><strong>Ticket #:</strong> ${entry.ticketNumber || "—"}</p>
          <p><strong>Plate:</strong> ${entry.numberPlate}</p>
          <p><strong>Driver:</strong> ${entry.driverName}</p>
          <p><strong>Vehicle Type:</strong> ${entry.vehicleType}</p>
          <p><strong>Arrival:</strong> ${formatDateTime(entry.arrivalTime)}</p>
          <p><strong>Out Time:</strong> ${formatDateTime(entry.outTime)}</p>
          <p><strong>Duration:</strong> ${entry.duration}</p>
          <p><strong>Amount Paid:</strong> UGX ${entry.fee.toLocaleString()}</p>
          <p class="note">Please keep this receipt as proof of payment.</p>
          <script>
            window.onload = () => window.print();
          </script>
        </body>
      </html>`;

    const printWindow = window.open("", "_blank", "width=700,height=800");
    if (!printWindow) {
      alert("Unable to open receipt window. Please allow pop-ups.");
      return;
    }

    printWindow.document.write(receiptHtml);
    printWindow.document.close();
  }

  function calculateFee(vehicleType, arrivalTime, signOutTime) {
    const durationMs = signOutTime - arrivalTime;
    const durationHrs = durationMs / (1000 * 60 * 60);
    const hour = new Date(arrivalTime).getHours();
    const isDay = hour >= 6 && hour < 19;
    const isShort = durationHrs < 3;

    const rates = {
      Truck: { short: 2000, day: 5000, night: 10000 },
      "Personal Car": { short: 2000, day: 3000, night: 2000 },
      Taxi: { short: 2000, day: 3000, night: 2000 },
      Coaster: { short: 3000, day: 4000, night: 2000 },
      "Boda Boda": { short: 1000, day: 2000, night: 2000 },
    };

    const r = rates[vehicleType] || rates["Personal Car"];
    return isShort ? r.short : isDay ? r.day : r.night;
  }

  function clearSidebar() {
    currentEntry = null;
    sidebarMessage.textContent = "Search a ticket or plate to see details here.";
    sidebarDetails.hidden = true;
    sbStatus.textContent = "PENDING SIGN-OUT";
    sbStatus.className = "status-badge pending";
    sbSignOut.disabled = true;
  }

  function showSidebarEntry(entry) {
    currentEntry = entry;
    sidebarDetails.hidden = false;
    sidebarMessage.textContent = "";

    const now = Date.now();
    const arrivalMs = new Date(entry.arrivalTime || entry.date || Date.now()).getTime();
    const durationMs = Math.max(0, now - arrivalMs);

    sbDriver.textContent = entry.driverName;
    sbPlate.textContent = entry.numberPlate;
    sbTicket.textContent = entry.ticketNumber || entry.receiptId || "—";
    sbVehicle.textContent = entry.vehicleType;
    sbArrival.textContent = formatDateTime(entry.arrivalTime || entry.date);
    sbDuration.textContent = formatDuration(durationMs);
    sbFee.textContent = `UGX ${calculateFee(entry.vehicleType, arrivalMs, now).toLocaleString()}`;

    sbSignOut.disabled = false;
  }

  function findEntry(query) {
    const normalized = (query || "").trim().toLowerCase();
    if (!normalized) return null;

    const entries = getRegistrations();
    return entries.find((entry) => {
      const plate = (entry.numberPlate || "").toLowerCase();
      const ticketNumber = (entry.ticketNumber || entry.receiptId || "").toLowerCase();
      return plate === normalized || ticketNumber === normalized;
    });
  }

  function handleSearch() {
    clearSidebar();
    const entry = findEntry(searchQuery.value);
    if (!entry) {
      sidebarMessage.textContent = "No matching ticket found. Try a different ticket or plate.";
      return;
    }

    showSidebarEntry(entry);
  }

  function handleSignOut() {
    if (!currentEntry) return;

    const now = new Date();
    const arrivalMs = new Date(currentEntry.arrivalTime || currentEntry.date || Date.now()).getTime();
    const durationMs = Math.max(0, now.getTime() - arrivalMs);
    const durationLabel = formatDuration(durationMs);
    const fee = calculateFee(currentEntry.vehicleType, arrivalMs, now.getTime());
    const receiptNumber = getNextReceiptNumber();

    const signoutEntry = {
      receiptNumber,
      ticketNumber: currentEntry.ticketNumber || currentEntry.receiptId || null,
      numberPlate: currentEntry.numberPlate,
      driverName: currentEntry.driverName,
      vehicleType: currentEntry.vehicleType,
      arrivalTime: currentEntry.arrivalTime || currentEntry.date,
      outTime: now.toISOString(),
      duration: durationLabel,
      fee,
      signoutDate: formatDateKey(now),
      createdAt: now.toISOString(),
    };

    const signouts = getSignouts();
    signouts.push(signoutEntry);
    saveSignouts(signouts);

    const remaining = getRegistrations().filter((entry) => {
      const entryTicket = entry.ticketNumber || entry.receiptId;
      const currentTicket = currentEntry.ticketNumber || currentEntry.receiptId;
      return entryTicket !== currentTicket;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(remaining));

    sbStatus.textContent = "SIGNED OUT";
    sbStatus.className = "status-badge complete";
    sbSignOut.disabled = true;

    printPaymentReceipt(signoutEntry);
  }

  searchBtn?.addEventListener("click", handleSearch);
  sbSignOut?.addEventListener("click", handleSignOut);

  document.addEventListener("DOMContentLoaded", () => {
    clearSidebar();
  });
})();
