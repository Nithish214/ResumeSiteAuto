import Contact from "../models/Contact.js";
import { sendContactNotification } from "../utils/sendEmail.js";

/**
 * @route   POST /api/contacts
 * @desc    Create a new recruiter contact submission
 * @access  Public (this is the public-facing contact form)
 *
 * By the time this function runs, contactValidationRules + runValidation
 * have already confirmed req.body is well-formed, so this function can
 * focus purely on saving the data.
 */
export const createContact = async (req, res, next) => {
  try {
    const {
      recruiterName,
      companyName,
      workEmail,
      phoneNumber,
      jobTitle,
      message,
      preferredCallbackTime,
      site,
    } = req.body;

    const contact = await Contact.create({
      recruiterName,
      companyName,
      workEmail,
      phoneNumber,
      jobTitle,
      message,
      preferredCallbackTime,
      site,
    });

    // Await this (rather than fire-and-forget) since Lambda can freeze
    // background work after the response is sent - see utils/sendEmail.js
    // for why a failure here never blocks the actual submission.
    await sendContactNotification(contact);

    res.status(201).json({
      success: true,
      message: "Thanks for reaching out - I'll get back to you soon.",
      data: contact,
    });
  } catch (error) {
    // Pass to the centralized error handler in middleware/errorHandler.js
    next(error);
  }
};

/**
 * @route   GET /api/contacts
 * @desc    List recruiter contact submissions, most recent first. Supports
 *          an optional ?search= query param that matches against recruiter
 *          name, company, work email, or job title (case-insensitive), and
 *          an optional ?site= param to filter to one resume version's
 *          submissions only (e.g. "sre" or "java").
 * @access  Admin only - protected by verifyToken (see routes/contactRoutes.js)
 */
export const getContacts = async (req, res, next) => {
  try {
    const { search, site } = req.query;
    let query = {};

    if (search && search.trim()) {
      // Escape regex special characters so a search containing e.g. "."
      // or "(" doesn't throw or behave unexpectedly - treat the input as
      // literal text to search for, not as a regex pattern itself.
      const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(escaped, "i");

      query.$or = [
        { recruiterName: regex },
        { companyName: regex },
        { workEmail: regex },
        { jobTitle: regex },
      ];
    }

    if (site && site.trim()) {
      query.site = site.trim();
    }

    const contacts = await Contact.find(query).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/contacts/:id
 * @desc    Fetch a single recruiter contact submission by its Mongo _id
 * @access  Admin only - protected by verifyToken
 */
export const getContactById = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact submission not found",
      });
    }

    res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/contacts/:id
 * @desc    Permanently delete a single recruiter contact submission
 * @access  Admin only - protected by verifyToken
 */
export const deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact submission not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Contact submission deleted",
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};
