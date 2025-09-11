# 🔐 EdVerse Access Control Matrix

## Overview

This document provides a comprehensive breakdown of what each role can access in each plan tier of the EdVerse MVP system.

### Plan Structure
- **Free** (Gray) - Explore your data and workflows in read-only mode. To run daily operations, upgrade to Starter.
- **Starter** (Green) - Daily operations + basic portals for active schools
- **Growth** (Blue) - Analytics + advanced features for growing institutions. Growth does not add new CRUD features — it only adds Analytics on top of Starter plan features.

> New organizations receive a 7-day **Starter trial** with full write access. After the trial, the plan automatically downgrades to **Free (read-only)** unless upgraded.

### Role Hierarchy
- **Owner** - Tenant super admin with full access *within the limits of the plan* plus billing and organization management rights
- **Admin** - Full management capabilities within plan limits
- **Teacher** - Teaching-focused capabilities within plan limits
- **Finance** - Fee management and financial operations (limited scope)
- **Parent** - Portal access to child's information (plan-gated)
- **Student** - Portal access to own information (plan-gated)

---

## 🎯 Role × Plan Access Matrix

| Role | Free Plan | Starter Plan | Growth Plan |
|------|-----------|--------------|-------------|
| **Owner** | ✅ **All Free Features + Billing** | ✅ **All Starter Features + Billing** | ✅ **All Growth Features + Billing** |
| **Admin** | 🔍 **Read-Only** | ⚡ **Full Operations** | 📈 **+ Analytics** |
| **Teacher** | 🔍 **Read-Only** | ⚡ **Teaching Tools** | 📈 **+ Analytics** |
| **Admissions** | **Not in MVP** | **Not in MVP** | **Not in MVP** |
| **Finance** | 🔍 **View Fees** | 🔍 **View + Record Manual + Export Fees** | 🔍 **View + Record Manual + Export Fees** |
| **Parent** | ❌ **No Access** | 👨‍👩‍👧‍👦 **Parent Portal** | 👨‍👩‍👧‍👦 **Parent Portal** |
| **Student** | ❌ **No Access** | 🎓 **Student Portal** | 🎓 **Student Portal** |

---

## 👑 Owner Role - Tenant Super Admin

**Capability:** `['*']` (within plan limits) + **billing management**

The Owner role is the **primary account holder** for a school/organization.
They can always:

* Manage **billing & subscription** (`billing.manage`)
* Manage **organization lifecycle** (`org.manage`, `tenant.delete`, `tenant.suspend`)
* **Invite/remove staff** including Admins
* Transfer ownership (one at a time per tenant)

But importantly:

* **Owner is still bound by the tenant's plan.**

  * On **Free**, Owner is read-only (except billing).
  * On **Starter**, Owner has full Starter capabilities + billing.
  * On **Growth**, Owner has full Growth capabilities + billing.

### Owner Capabilities by Plan

#### Free Plan
* View-only across students, courses, classes, attendance, results, notices, fees
* Billing access (can upgrade to Starter/Growth)

#### Starter Plan
* All Starter features (CRUD ops, staff management, integrations, parent/student portals)
* Billing access

#### Growth Plan
* All Starter features + analytics
* Billing access

---

## 👨‍💼 Admin Role - Management Capabilities

### Free Plan - Read-Only Access
| Capability | Access | Description |
|------------|--------|-------------|
| `students.view` | ✅ | View student information |
| `courses.view` | ✅ | View course catalog |
| `classes.view` | ✅ | View class schedules |
| `attendance.view` | ✅ | View attendance records |
| `results.view` | ✅ | View grades and results |
| `notices.view` | ✅ | View notices and announcements |
| `fees.view` | ✅ | View fee information |

### Starter Plan - Full Operations
| Capability | Access | Description |
|------------|--------|-------------|
| **Students** | | |
| `students.create` | ✅ | Add new students |
| `students.update` | ✅ | Edit student information |
| `students.delete` | ✅ | Remove students |
| **Courses** | | |
| `courses.create` | ✅ | Create new courses |
| `courses.update` | ✅ | Edit course details |
| `courses.delete` | ✅ | Remove courses |
| **Classes** | | |
| `classes.create` | ✅ | Create new classes |
| `classes.update` | ✅ | Edit class details |
| `classes.delete` | ✅ | Remove classes |
| `classes.reschedule` | ✅ | Reschedule classes |
| **Attendance** | | |
| `attendance.record` | ✅ | Mark attendance |
| `attendance.import` | ✅ | Bulk import attendance |
| **Results** | | |
| `results.enter` | ✅ | Enter grades and results |
| `results.publish` | ✅ | Publish results |
| `results.export` | ✅ | Export results |
| **Notices** | | |
| `notices.send` | ✅ | Send notices to students/parents |
| **Fees** | | |
| `fees.record_manual` | ✅ | Record manual fee payments |
| `fees.export` | ✅ | Export fee reports |
| **Management** | | |
| `staff.invite` | ✅ | Invite new staff members |
| `org.manage` | ✅ | Manage organization settings |
| `settings.integrations` | ✅ | Configure integrations |

### Growth Plan - Analytics Added
| Capability | Access | Description |
|------------|--------|-------------|
| `analytics.view` | ✅ | Access analytics dashboard |

> Growth does not add new CRUD features — it only adds Analytics on top of Starter plan features.

---

## 👨‍🏫 Teacher Role - Teaching Focused

### Free Plan - Read-Only Access
| Capability | Access | Description |
|------------|--------|-------------|
| `classes.view` | ✅ | View assigned classes |
| `attendance.view` | ✅ | View attendance records |
| `results.view` | ✅ | View grades and results |
| `notices.view` | ✅ | View notices and announcements |
| `students.view` | ✅ | View student information |
| `courses.view` | ✅ | View course information |
| `fees.view` | ✅ | View fee information |

### Starter Plan - Teaching Tools
| Capability | Access | Description |
|------------|--------|-------------|
| `attendance.record` | ✅ | Mark student attendance |
| `results.enter` | ✅ | Enter grades and results |
| `notices.send` | ✅ | Send notices to students/parents |

### Growth Plan - Analytics Added
| Capability | Access | Description |
|------------|--------|-------------|
| `analytics.view` | ✅ | Access analytics dashboard |

> Growth does not add new CRUD features — it only adds Analytics on top of Starter plan features.

---


## 💰 Finance Role - Financial Management

**Note:** Finance role capabilities scale with the plan: view-only on Free; full fee management on Starter/Growth.

### Free Plan
| Capability | Access | Description |
|------------|--------|-------------|
| `fees.view` | ✅ | View all fee information |

### Starter & Growth Plans
| Capability | Access | Description |
|------------|--------|-------------|
| `fees.view` | ✅ | View all fee information |
| `fees.record_manual` | ✅ | Record manual fee payments |
| `fees.export` | ✅ | Export fee reports |

---

## 👨‍👩‍👧‍👦 Parent Role - Portal Access

### Free Plan - No Access
| Capability | Access | Description |
|------------|--------|-------------|
| All portal features | ❌ | No portal access on Free plan |

### Starter & Growth Plans - Full Portal Access
| Capability | Access | Description |
|------------|--------|-------------|
| `portal.parent` | ✅ | Access parent portal |
| `portal.parent.attendance.view` | ✅ | View child's attendance |
| `portal.parent.results.view` | ✅ | View child's grades and results |
| `portal.parent.notices.view` | ✅ | View notices and announcements |

---

## 🎓 Student Role - Portal Access

### Free Plan - No Access
| Capability | Access | Description |
|------------|--------|-------------|
| All portal features | ❌ | No portal access on Free plan |

### Starter & Growth Plans - Full Portal Access
| Capability | Access | Description |
|------------|--------|-------------|
| `portal.student` | ✅ | Access student portal |
| `portal.student.courses.view` | ✅ | View enrolled courses |
| `portal.student.results.view` | ✅ | View own grades and results |
| `portal.student.attendance.view` | ✅ | View own attendance |
| `portal.student.notices.view` | ✅ | View notices and announcements |

---

## 🧪 Testing Scenarios

### Free Plan Testing
1. **Owner on Free:** Can only view data + manage billing (still bound by plan limits)
2. **Admin on Free:** Can only view data, cannot create/edit/delete
3. **Teacher on Free:** Can only view classes/attendance/results, cannot record
4. **Parent/Student on Free:** No portal access
5. **Finance on Free:** View fees only

### Starter Plan Testing
1. **Owner on Starter:** Full Starter features + billing
2. **Admin on Starter:** Full CRUD operations + staff management
3. **Teacher on Starter:** Can record attendance, enter results, send notices
4. **Parent/Student on Starter:** Full portal access
5. **Finance on Starter:** View + record manual + export fees

### Growth Plan Testing
1. **Owner on Growth:** Full Growth features + billing
2. **Admin on Growth:** Starter features + Analytics
3. **Teacher on Growth:** Starter features + Analytics
4. **Parent/Student on Growth:** Same as Starter
5. **Finance on Growth:** Same as Starter

---

## 🎯 Key Testing Points

### Plan Upgrade Testing
- [ ] Free → Starter: Verify new capabilities unlock
- [ ] Starter → Growth: Verify analytics access unlocks
- [ ] Downgrade scenarios: Verify features lock appropriately

### Role Restriction Testing
- [ ] Each role only sees appropriate features
- [ ] Owner always has billing & tenant management; feature access follows the tenant's plan
- [ ] Finance has limited scope regardless of plan

### Feature Gating Testing
- [ ] Locked features show upgrade prompts
- [ ] Upgrade prompts are contextual and helpful
- [ ] Billing page reflects current plan accurately

### Portal Access Testing
- [ ] Parent/Student portals only accessible on Starter+ plans
- [ ] Portal features work correctly for each role
- [ ] Portal access is properly restricted by role

### Analytics Testing
- [ ] Analytics only accessible on Growth plan
- [ ] Analytics show appropriate data for user's role
- [ ] Analytics are properly gated with upgrade prompts

---

## 📊 Plan Comparison Summary

*Trial plan gives full Starter access for 7 days.*

| Feature Category | Free | Starter | Growth |
|------------------|------|---------|--------|
| **Trial (7 days)** | 🚀 **Full Starter Features** | | |
| **Data Viewing** | ✅ | ✅ | ✅ |
| **Data Management** | ❌ | ✅ | ✅ |
| **Teaching Tools** | ❌ | ✅ | ✅ |
| **Staff Management** | ❌ | ✅ | ✅ |
| **Parent Portal** | ❌ | ✅ | ✅ |
| **Student Portal** | ❌ | ✅ | ✅ |
| **Analytics** | ❌ | ❌ | ✅ |
| **Integrations** | ❌ | ✅ | ✅ |

⚠️ **Owner Clarification:** The Owner role has unrestricted access *within the limits of the tenant's plan*. Owners cannot bypass plan limits but always retain billing and tenant management rights.

---

## 🚀 Development Priorities

### Phase 1: Core Functionality
1. **Free Plan:** Ensure read-only access works correctly
2. **Starter Plan:** Implement CRUD operations and portals
3. **Growth Plan:** Add analytics dashboard
4. **Implement trial:** set `plan=starter` + `trial_ends_at=now()+7d`; add auto-downgrade job.

### Phase 2: Role Refinement
1. **Owner Role:** Test plan-limited access + billing scenarios
2. **Admin Role:** Verify management capabilities
3. **Teacher Role:** Test teaching-focused features
4. **Portal Roles:** Test parent/student portal access

### Phase 3: Edge Cases
1. **Plan Downgrades:** Handle feature locking gracefully
2. **Role Changes:** Ensure proper access updates
3. **Error Handling:** Test invalid plan/role combinations

---

*This matrix is maintained as part of the EdVerse MVP system and should be updated when access control changes are made.*
