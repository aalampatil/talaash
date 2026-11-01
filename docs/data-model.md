```Js
title talaash
// ─── CORE ENTITIES ───

tenants [icon: user, color: blue] {
  id string pk
  clerkid
  name string
  email string
  phone string
  created_at datetime
}

owners [icon: briefcase, color: purple] {
  id string pk
  name string
  email string
  phone string
  created_at datetime
}

admins [icon: shield, color: red] {
  id string pk
  clerkid
  name string
  email string
  role string
  created_at datetime
}

// ─── PROPERTY ───

properties [icon: home, color: green] {
  id string pk
  owner_id string fk
  title string
  description string
  city string
  locality string
  address string
  monthly_rent int
  deposit_amount int
  bedrooms int
  bathrooms int
  area_sqft int
  available_from date
  listing_status string
  created_at datetime
  updated_at datetime
}

property_images [icon: image, color: green] {
  id string pk
  property_id string fk
  image_url string
  is_cover boolean
  uploaded_at datetime
}

amenities [icon: star, color: green] {
  id string pk
  name string
}

property_amenities [icon: git-merge, color: green] {
  id string pk
  property_id string fk
  amenity_id string fk
}

property_rules [icon: alert-circle, color: green] {
  id string pk
  property_id string fk
  rule string
}

property_availability [icon: calendar, color: green] {
  id string pk
  property_id string fk
  available_from date
  available_to date
  is_available boolean
}

listing_status_log [icon: clock, color: green] {
  id string pk
  property_id string fk
  changed_by_admin_id string fk
  old_status string
  new_status string
  changed_at datetime
  remarks string
}

// ─── OWNERS ───



// ─── SEARCH & DISCOVERY ───

search_filters [icon: filter, color: yellow] {
  id string pk
  tenant_id string fk
  location_text string
  min_budget int
  max_budget int
  move_in_date date
  bedrooms int
  searched_at datetime
}

shortlists [icon: bookmark, color: yellow] {
  id string pk
  tenant_id string fk
  property_id string fk
  shortlisted_at datetime
}

property_comparisons [icon: columns, color: yellow] {
  id string pk
  tenant_id string fk
  created_at datetime
}

comparison_items [icon: list, color: yellow] {
  id string pk
  comparison_id string fk
  property_id string fk
}

// ─── VISIT WORKFLOW ───

visit_requests [icon: map-pin, color: orange] {
  id string pk
  tenant_id string fk
  property_id string fk
  preferred_date date
  preferred_time string
  status string
  created_at datetime
}

visit_schedule [icon: calendar, color: orange] {
  id string pk
  visit_request_id string fk
  scheduled_date date
  scheduled_time string
  confirmed_by_admin_id string fk
  scheduled_at datetime
}

visit_outcomes [icon: check-circle, color: orange] {
  id string pk
  visit_request_id string fk
  outcome string
  tenant_notes string
  recorded_at datetime
}

// ─── MOVE-IN WORKFLOW ───

move_in_applications [icon: file-text, color: teal] {
  id string pk
  tenant_id string fk
  property_id string fk
  move_in_date date
  status string
  created_at datetime
}

move_in_checklist [icon: check-square, color: teal] {
  id string pk
  application_id string fk
  item_label string
  is_completed boolean
  completed_at datetime
}

document_uploads [icon: upload, color: teal] {
  id string pk
  application_id string fk
  document_type string
  file_url string
  uploaded_at datetime
  verified boolean
}

agreements [icon: file, color: teal] {
  id string pk
  application_id string fk
  agreement_url string
  signed_by_tenant boolean
  signed_by_owner boolean
  signed_at datetime
}

inventory_list [icon: package, color: teal] {
  id string pk
  application_id string fk
  item_name string
  condition string
  noted_at datetime
}

stay_extensions [icon: refresh-cw, color: teal] {
  id string pk
  application_id string fk
  requested_until date
  reason string
  status string
  requested_at datetime
  reviewed_at datetime
  reviewed_by_admin_id string fk
}

// ─── SUPPORT SYSTEM ───

support_tickets [icon: life-buoy, color: red] {
  id string pk
  raised_by_tenant_id string fk
  property_id string fk
  subject string
  status string
  priority string
  created_at datetime
  updated_at datetime
}

ticket_messages [icon: message-circle, color: red] {
  id string pk
  ticket_id string fk
  sender_id string
  sender_type string
  message string
  sent_at datetime
}

// ─── RELATIONSHIPS ───

// Owner - Property
owners.id - properties.owner_id

// Property details
properties.id - property_images.property_id
properties.id - property_amenities.property_id
amenities.id - property_amenities.amenity_id
properties.id - property_rules.property_id
properties.id - property_availability.property_id
properties.id - listing_status_log.property_id
admins.id - listing_status_log.changed_by_admin_id

// Discovery
tenants.id - search_filters.tenant_id
tenants.id - shortlists.tenant_id
properties.id - shortlists.property_id
tenants.id - property_comparisons.tenant_id
property_comparisons.id - comparison_items.comparison_id
properties.id - comparison_items.property_id

// Visit workflow
tenants.id - visit_requests.tenant_id
properties.id - visit_requests.property_id
visit_requests.id - visit_schedule.visit_request_id
admins.id - visit_schedule.confirmed_by_admin_id
visit_requests.id - visit_outcomes.visit_request_id

// Move-in workflow
tenants.id - move_in_applications.tenant_id
properties.id - move_in_applications.property_id
move_in_applications.id - move_in_checklist.application_id
move_in_applications.id - document_uploads.application_id
move_in_applications.id - agreements.application_id
move_in_applications.id - inventory_list.application_id
move_in_applications.id - stay_extensions.application_id
admins.id - stay_extensions.reviewed_by_admin_id

// Support
tenants.id - support_tickets.raised_by_tenant_id
properties.id - support_tickets.property_id
support_tickets.id - ticket_messages.ticket_id
```
