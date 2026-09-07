from django.db import models


class CabinetStatistic(models.Model):
    """Monthly aggregate statistics table (1 row per month).
    
    Provides ultra-low storage usage (<1.2 KB/year) while maintaining
    accurate historical performance, revenue metrics, and booking throughput.
    """
    year = models.PositiveIntegerField()
    month = models.PositiveIntegerField()
    bookings_created = models.PositiveIntegerField(default=0)
    bookings_done = models.PositiveIntegerField(default=0)
    bookings_cancled = models.PositiveIntegerField(default=0)
    total_revenue = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)

    class Meta:
        unique_together = ('year', 'month')
        ordering = ['-year', '-month']

    def __str__(self):
        return f'{self.year}-{self.month:02d}: Created={self.bookings_created}, Done={self.bookings_done}, Cancelled={self.bookings_cancled}, Rev={self.total_revenue}'
