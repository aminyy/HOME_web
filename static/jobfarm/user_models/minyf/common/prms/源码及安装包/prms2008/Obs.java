package prms2008;

import java.io.File;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

import java.util.logging.Level;
import java.util.logging.Logger;

import net.casnw.home.annotation.AccessType;
import net.casnw.home.annotation.Component;
import net.casnw.home.annotation.Parameter;
import net.casnw.home.annotation.Variable;
import net.casnw.home.core.AbstractComponent;
import net.casnw.home.core.IComponent;
import net.casnw.home.io.CSTable;
import net.casnw.home.io.DataIO;
//import oms3.io.DataIO;

@Component(name = "Obs",
author = "George H. Leavesley",
createTime = "2012-01-01",
description = "Read input variables.Reads input variables from the designated data file.",
keyword = "IO")

public class Obs extends AbstractComponent{

    // <editor-fold defaultstate="collapsed" desc="Private Variables">
    private static final Logger log = Logger.getLogger("oms3.model." + Obs.class.getSimpleName());
    /** Table Row Iterator */
    private Iterator<String[]> rows;
    private SimpleDateFormat f;
    private int last_day = 0;
    
    @Parameter(description = "")
    public File inputFile;
    
    @Parameter(description = "Ending date of the simulation.")
    public java.util.Calendar endTime;
    
    @Parameter(description = "Starting date of the simulation.")
    public java.util.Calendar startTime;
    
    @Parameter(description = "Code indicating rule for precip station use  (1=only precip if the regression stations have precip;  2=only precip if any station in the basin has precip;  3=precip if xyz says so;  4=only precip if rain_day variable is set to 1;  5=only precip if psta_freq_nuse stations see precip)")
    public int[] rain_code;
   
    @Parameter(description = "Kinematic routing switch (0=daily; 1=storm period)")
    public int route_on;
    
    @Parameter(description = "Measured runoff for each stream gage")
    public double[] runoff;
    
    @Parameter(description = "Measured precipitation at each rain gage")
    public double[] precip;
    
    @Parameter(description = "Measured daily minimum temperature at each measurement station")
    public double[] tmin;
    
    @Parameter(description = "Measured daily maximum temperature at each measurement station")
    public double[] tmax;
    
    @Parameter(description = "Measured solar radiation at each measurement station")
    public double[] solrad;
    
    @Parameter(description = "Measured pan evaporation at each measurement station")
    public double[] pan_evap;
    
    @Parameter(description = "Flag to force rain day")
    public int rain_day;
   
    @Parameter(description = "")
    public boolean moreData;
    
    @Parameter(description = "Date of the current time step")
    public Calendar date = new GregorianCalendar();
    
    @Parameter(description = "Length of the time step")
    public double deltim;
    
    @Parameter(description = "Switch signifying the start of a new day (0=no;  1=yes)")
    public int newday;
    
    // </editor-fold>
    int[] runoff_idx;
    int[] precip_idx;
    int[] tmin_idx;
    int[] tmax_idx;
    int[] solrad_idx;
    int[] pan_evap_idx;
    int rain_day_idx = -1;

    public static void read(double[] store, int[] idx, String row[]) {
        for (int i = 0; i < idx[1]; i++) {
            store[i] = Double.parseDouble(row[idx[0] + i]);
        }
    }

    public static int readInt(int idx, String row[]) {
        if (idx > -1) {
            return Integer.parseInt(row[idx]);
        }
        return Integer.MAX_VALUE;
    }

    public static int[] findArrayIndex(CSTable table, String name) {
        int[] idx = new int[]{0, 0};
        for (int i = 1; i <= table.getColumnCount(); i++) {
            if (table.getColumnName(i).startsWith(name)) {
                idx[0] = i;
                while (i <= table.getColumnCount() && table.getColumnName(i++).startsWith(name)) {
                    idx[1]++;
                }
                break;
            }
        }
        return idx;
    }

    public static int findScalarIndex(CSTable table, String name) {
        for (int i = 1; i < table.getColumnCount(); i++) {
            if (table.getColumnName(i).equals(name)) {
                return i;
            }
        }
        return -1;
    }

    private void updateData(String[] row) throws Exception {
        read(runoff, runoff_idx, row);
        read(precip, precip_idx, row);
        read(tmin, tmin_idx, row);
        read(tmax, tmax_idx, row);
        read(solrad, solrad_idx, row);
        read(pan_evap, pan_evap_idx, row);
        rain_day = readInt(rain_day_idx, row);
        int day = date.get(Calendar.DAY_OF_YEAR);
        if (last_day != day) {
            newday = 1;
            last_day = day;
        }
        if (rain_code[date.get(java.util.Calendar.MONTH)] != 4) {
            rain_day = 1;
        }
    }

    @Override
    public void init() {
        CSTable table = null;
        try {
            table = DataIO.table(inputFile, "obs");
        } catch (IOException ex) {
            Logger.getLogger(Obs.class.getName()).log(Level.SEVERE, null, ex);
        }
        f = DataIO.lookupDateFormat(table, 1);

        String d = table.getInfo().get(DataIO.DATE_START);
        if (d == null) {
            throw new RuntimeException("Missing start date: " + DataIO.DATE_START);
        }
        Date start = null;
        try {
            start = f.parse(d);
        } catch (ParseException ex) {
            Logger.getLogger(Obs.class.getName()).log(Level.SEVERE, null, ex);
        }

        d = table.getInfo().get(DataIO.DATE_END);
        if (d == null) {
            throw new RuntimeException("Missing end date: " + DataIO.DATE_END);
        }
        Date end = null;
        try {
            end = f.parse(d);
        } catch (ParseException ex) {
            Logger.getLogger(Obs.class.getName()).log(Level.SEVERE, null, ex);
        }

        if (startTime.getTime().before(start) || endTime.getTime().after(end) || endTime.before(startTime)) {
            throw new RuntimeException("Illegal start/end for "
                    + f.format(startTime.getTime()) + " - " + f.format(endTime.getTime()));
        }

        date.setTime(start);
        rows = table.rows().iterator();

        deltim = 24.0;
        route_on = 0;
        newday = 1;
        last_day = 0;
        //
        runoff_idx = findArrayIndex(table, "runoff");
        runoff = new double[runoff_idx[1]];
        precip_idx = findArrayIndex(table, "precip");
        precip = new double[precip_idx[1]];
        tmin_idx = findArrayIndex(table, "tmin");
        tmin = new double[tmin_idx[1]];
        tmax_idx = findArrayIndex(table, "tmax");
        tmax = new double[tmax_idx[1]];
        solrad_idx = findArrayIndex(table, "solrad");
        solrad = new double[solrad_idx[1]];
        pan_evap_idx = findArrayIndex(table, "pan_evap");
        pan_evap = new double[pan_evap_idx[1]];
        rain_day_idx = findScalarIndex(table, "rain_day");
    }

    @Override
    public void run() {
        String[] row = null;
        if (rows == null) {
            init();
            while (date.before(startTime)) {
                row = rows.next();
                try {
                    date.setTime(f.parse(row[1]));
                } catch (ParseException ex) {
                    Logger.getLogger(Obs.class.getName()).log(Level.SEVERE, null, ex);
                }
            }
            if (row == null) {                              // first day
                row = rows.next();
            }
            try {
                date.setTime(f.parse(row[1]));
            } catch (ParseException ex) {
                Logger.getLogger(Obs.class.getName()).log(Level.SEVERE, null, ex);
            }
            try {
                updateData(row);
            } catch (Exception ex) {
                Logger.getLogger(Obs.class.getName()).log(Level.SEVERE, null, ex);
            }
        } else if (rows.hasNext()) {
            row = rows.next();
            try {
                date.setTime(f.parse(row[1]));
            } catch (ParseException ex) {
                Logger.getLogger(Obs.class.getName()).log(Level.SEVERE, null, ex);
            }
            if (date.equals(endTime) || date.after(endTime)) {
                moreData = false;
                return;
            }
            try {
                updateData(row);
            } catch (Exception ex) {
                Logger.getLogger(Obs.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        moreData = rows.hasNext();
        if (log.isLoggable(Level.INFO)) {
            log.log(Level.INFO, "date:[{0}] runoff:{1} precip:{2} tmin:{3} tmax:{4} solrad:{5}", new Object[]{f.format(date.getTime()), Arrays.toString(runoff), Arrays.toString(precip), Arrays.toString(tmin), Arrays.toString(tmax), Arrays.toString(solrad)});
        }
    }

    @Override
    public void clear() {
        
    }
}
