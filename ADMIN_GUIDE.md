# 📋 **Admin Guide: How to Use the Volunteer Management System**

## 🎯 **Quick Reference**

### **For PENDING Registrations:**
- **✓ Approve** → Changes to "Approved (Registered)" (NO HOURS)
- **✗ Reject** → Changes to "Rejected" (NO HOURS)

### **For APPROVED Registrations:**
- **✓ Mark Attended (Award Hours)** → Changes to "Attended" (4 HOURS AWARDED)
- **✗ Mark Absent (No Hours)** → Changes to "Absent" (NO HOURS)
- **✗ Reject** → Changes to "Rejected" (NO HOURS)

### **For REJECTED Registrations:**
- **✓ Approve** → Changes to "Approved (Registered)" (NO HOURS)

## 🔄 **Complete Workflow**

### **Step 1: Review Pending Registrations**
```
Status: PENDING
Actions: ✓ Approve | ✗ Reject
Result: 
- Approve → Status: "Approved (Registered)" (0 hours)
- Reject → Status: "Rejected" (0 hours)
```

### **Step 2: After Event - Mark Attendance**
```
Status: APPROVED (REGISTERED)
Actions: ✓ Mark Attended (Award Hours) | ✗ Mark Absent (No Hours) | ✗ Reject
Result:
- Mark Attended → Status: "Attended" (4 hours awarded)
- Mark Absent → Status: "Absent" (0 hours)
- Reject → Status: "Rejected" (0 hours)
```

## 📊 **What Each Status Means**

### **🟡 PENDING**
- Volunteer just registered
- Waiting for admin approval
- **0 hours** awarded
- **Actions**: Approve or Reject

### **🟢 APPROVED (REGISTERED)**
- Admin approved the volunteer
- Volunteer can attend the event
- **0 hours** awarded (no attendance yet)
- **Actions**: Mark Attended, Mark Absent, or Reject

### **✅ ATTENDED**
- Volunteer actually attended the event
- **4 hours** automatically awarded
- Hours can be edited by admin
- **Actions**: None (final state)

### **❌ ABSENT**
- Volunteer didn't show up despite being approved
- **0 hours** awarded
- **Actions**: None (final state)

### **🔴 REJECTED**
- Admin rejected the registration
- **0 hours** awarded
- **Actions**: Can be re-approved

## 🎯 **When to Use Each Button**

### **Before Event:**
1. **Review pending registrations**
2. **Click "✓ Approve"** for volunteers you want to allow
3. **Click "✗ Reject"** for volunteers you want to deny

### **After Event:**
1. **For each approved volunteer:**
   - **Click "✓ Mark Attended (Award Hours)"** if they came
   - **Click "✗ Mark Absent (No Hours)"** if they didn't come

## 💡 **Pro Tips**

### **✅ Best Practices:**
- **Always approve before the event** - don't wait until after
- **Mark attendance after the event** - this is when hours are awarded
- **Use "Mark Absent" for no-shows** - this tracks who didn't come
- **Edit hours if needed** - for attended volunteers only

### **⚠️ Important Notes:**
- **Hours are ONLY awarded for "Attended" status**
- **Approval never awards hours** - only attendance does
- **You can edit hours** for attended volunteers
- **Final states cannot be changed** (Attended/Absent)

## 🔍 **Troubleshooting**

### **Q: I don't see "Mark Attended" buttons**
**A:** Make sure the registration status is "Approved (Registered)". If it's still "Pending", approve it first.

### **Q: Hours aren't being awarded**
**A:** Check that you're clicking "Mark Attended" and not just "Approve". Only attendance awards hours.

### **Q: Can I change an "Attended" back to "Approved"?**
**A:** No, "Attended" is a final state. Once someone is marked as attended, it cannot be changed.

### **Q: Can I change an "Absent" back to "Approved"?**
**A:** No, "Absent" is a final state. Once someone is marked as absent, it cannot be changed.

## 📈 **Dashboard Statistics**

- **Total Registrations**: All registrations
- **Pending**: Awaiting your approval
- **Approved**: Approved to attend (no hours yet)
- **Attended**: Actually attended (with hours)
- **Absent**: Didn't attend (no hours)
- **Rejected**: Registration denied
- **Total Service Hours**: Only from attended volunteers

## 🎯 **Summary**

**The system is simple:**
1. **Approve** volunteers before the event (no hours)
2. **Mark attendance** after the event (hours awarded)
3. **Only attendance awards hours** - not approval
4. **Track everything** with clear status indicators

**Your volunteers now only get service hours when they actually attend events!**



















