# app/models/__init__.py
from app.models.user             import User             # noqa: F401
from app.models.activity_log     import ActivityLog      # noqa: F401
from app.models.attendance       import AttendanceRecord, AttendanceSummary  # noqa: F401
from app.models.results          import Result           # noqa: F401
from app.models.internal_test    import InternalTest     # noqa: F401
from app.models.goal             import Goal             # noqa: F401
from app.models.placement        import Placement        # noqa: F401
from app.models.student          import Student          # noqa: F401
from app.models.staff_assignment import StaffAssignment  # noqa: F401
from app.models.password_reset   import PasswordResetToken  # noqa: F401