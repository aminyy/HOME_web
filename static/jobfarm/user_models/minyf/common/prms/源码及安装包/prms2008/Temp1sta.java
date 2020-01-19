package prms2008;

import java.util.Calendar;
import java.util.logging.*;
import net.casnw.home.annotation.*;
import net.casnw.home.core.AbstractComponent;

@Component(name="Templsta",
        author = "George H. Leavesley",
        createTime = "2012-0101",
        description="Temperature distribution." +
    "Distributes temperatures to HRU's using temperature data measured at a station" +
    "and a monthly parameter based on the lapse rate with elevation.",
         keyword="Temperature",
         version="$Id: Temp1sta.java 861 2010-01-21 01:54:38Z ghleavesley $",
         source="$URL: http://svn.javaforge.com/svn/oms/branches/oms3.prj.prms2008/src/prms2008/Temp1sta.java $")
    
public class Temp1sta extends AbstractComponent{

    private static final Logger log = Logger.getLogger("oms3.model." + Temp1sta.class.getSimpleName());
    
    // private fields
    private double tcrn[];
    private double tcrx[];
    private double tcr[];
    private double elfac[];
    private double[] obs_temp;   // ???????

    // Input param
    @Parameter(description="Number of HRUs.")
    public int nhru;

    @Parameter(description="Number of temperature stations.")
     public int ntemp;

    @Parameter(description="Index of main temperature station Index of temperature station used to compute basin  temperature values")
     public int basin_tsta;

    @Parameter(description="Area of each HRU",unit="acres",dimension="nhru")
     public double[] hru_area;

    @Parameter(description="Mean elevation for each HRU",unit="elev_units",dimension="nhru")
     public double[] hru_elev;

    @Parameter(description="Index of the base temperature station used for lapse  rate calculations",
            dimension="nhru")
     public int[] hru_tsta;

    @Parameter(description="Units for measured temperature (0=Fahrenheit; 1=Celsius)")
    public int temp_units;

    @Parameter(description="Adjustment to maximum temperature for each HRU, estimated  based on slope and aspect",
            unit="degrees",dimension="nhru")
    public double[] tmax_adj;

    @Parameter(description="Adjustment to minimum temperature for each HRU, estimated  based on slope and aspect",
            unit="degrees",dimension="nhru")
     public double[] tmin_adj;

    @Parameter(description="Array of twelve values representing the change in maximum temperature per 1000 elev_units of elevation change for each month, January to December",
            unit="degrees",dimension="nmonths")
     public double[] tmax_lapse;

    @Parameter(description="Array of twelve values representing the change in minimum temperture per 1000 elev_units of  elevation change for each month, January to December",
            unit="degrees",dimension="nmonths")
     public double[] tmin_lapse;

    @Parameter(description="Elevation of each temperature measurement station",
            unit="elev_units",dimension="ntemp")
     public double[] tsta_elev;


    // Input var
    @Variable(access =AccessType.IN,description="Routing order for HRUs",dimension="nhru")
     public int[] hru_route_order;

    @Variable(access =AccessType.IN,description="Inverse of total basin area as sum of HRU areas",
            unit="1/acres")
     public double basin_area_inv;

    @Variable(access =AccessType.IN,description="Number of active HRUs")
     public int active_hrus;

    @Variable(access =AccessType.IN,description="Measured maximum temperature at each temperature measurement station, F or C depending on units of data. [obs]",
            dimension="nhru")
    public double[] tmax;

    @Variable(access =AccessType.IN,description="Measured minimum temperature at each temperature measurement station, F or C depending on units of data. [obs]",
            dimension="nhru")
     public double[] tmin;

   @Variable(access =AccessType.IN,description="Kinematic routing switch - 0= non storm period, 1=storm period [obs]")
    public int route_on;

   @Variable(access =AccessType.IN,description="Date of the current time step",unit="yyyy mm dd hh mm ss")
     public Calendar date;

    // Output var
   @Variable(access =AccessType.OUT,description="Basin area-weighted temperature for timestep < 24",unit="degrees")
     public double basin_temp;

   @Variable(access =AccessType.OUT,description="Basin area-weighted daily maximum temperature",unit="degrees") 
   public double basin_tmax;

   @Variable(access =AccessType.OUT,description="Basin area-weighted daily minimum temperature",unit="degrees")
    public double basin_tmin;

   @Variable(access =AccessType.OUT,description="HRU adjusted daily average temperature",unit="degrees Celsius",
           dimension="nhru")
    public double[] tavgc;

    @Variable(access =AccessType.OUT,description="HRU adjusted daily average temperature",
            unit="degrees F",dimension="nhru")
    public double[] tavgf;

    @Variable(access =AccessType.OUT,description="HRU adjusted daily maximum temperature",
            unit="degrees Celsius",dimension="nhru")
     public double[] tmaxc;

    @Variable(access =AccessType.OUT,description="HRU adjusted daily maximum temperature",
            unit="degrees F",dimension="nhru")
    public double[] tmaxf;

    @Variable(access =AccessType.OUT,description="HRU adjusted daily minimum temperature",
            unit="degrees Celsius",dimension="nhru")
    public double[] tminc;

    @Variable(access =AccessType.OUT,description="HRU adjusted daily minimum temperature",
            unit="degrees F",dimension="nhru")
     public double[] tminf;

    @Variable(access =AccessType.OUT,description="HRU adjusted temperature for timestep < 24",
            unit="degrees Celsius",dimension="nhru")
     public double[] tempc;

    @Variable(access =AccessType.OUT,description="HRU adjusted temperature for timestep < 24",
            unit="degrees F",dimension="nhru")
    public double[] tempf;
    
    @Variable(access =AccessType.OUT,description="Basin daily maximum temperature for use with solrad radiation",
            unit="degrees")
     public double solrad_tmax;
    
    @Variable(access =AccessType.OUT,description="Basin daily minimum temperature for use with solrad radiation",
            unit="degrees")
     public double solrad_tmin;

    public void init() {
        obs_temp = new double[ntemp];  //TODO is obs_temp needed?
        tavgc = new double[nhru];
        tavgf = new double[nhru];
        tempc = new double[nhru];
        tempf = new double[nhru];
        tmaxc = new double[nhru];
        tmaxf = new double[nhru];
        tminc = new double[nhru];
        tminf = new double[nhru];
        
        tcrn = new double[nhru];
        tcrx = new double[nhru];
        tcr = new double[nhru];
        elfac = new double[nhru];

        int mo = date.get(Calendar.MONTH);
        double tmaxlaps = tmax_lapse[mo];
        double tminlaps = tmin_lapse[mo];
        for (int j = 0; j < nhru; j++) {
            if (hru_tsta[j] < 1) {
                hru_tsta[j] = 1;
            }
            if (hru_tsta[j] > ntemp) {
                throw new RuntimeException("***error, hru_tsts>ntemp, HRU: " + j);
            }
            int k = hru_tsta[j] - 1;
            elfac[j] = (hru_elev[j] - tsta_elev[k]) / 1000.;
            tcrx[j] = tmaxlaps * elfac[j] - tmax_adj[j];
            tcrn[j] = tminlaps * elfac[j] - tmin_adj[j];
            tcr[j] = (tcrx[j] + tcrn[j]) * 0.5;
        }
    }

    @Override
    public void run() {
        if (elfac == null) {
            init();
        }
        
        double ts_temp = 0.;

        int mo = date.get(Calendar.MONTH);
        int day = date.get(Calendar.DAY_OF_MONTH);

        basin_tmax = 0.0;
        basin_tmin = 0.0;
        basin_temp = 0.0;

        double tmaxlaps = tmax_lapse[mo];
        double tminlaps = tmin_lapse[mo];

        for (int jj = 0; jj < active_hrus; jj++) {
            int j = hru_route_order[jj];
            int k = hru_tsta[j] - 1;

            if (day == 1) {
                tcrx[j] = tmaxlaps * elfac[j] - tmax_adj[j];
                tcrn[j] = tminlaps * elfac[j] - tmin_adj[j];
                if (route_on == 1) {
                    tcr[j] = (tcrx[j] + tcrn[j]) * 0.5;
                }
            }
            
            double tmn = tmin[k] - tcrn[j];
            double tmx = tmax[k] - tcrx[j];
//            System.out.println("day " + day + " tmx =" + tmx + " tmn =" + tmn);

            if (route_on == 1) {
                ts_temp = obs_temp[k] - tcr[j];     /// obs_temp ????
                basin_temp = basin_temp + ts_temp * hru_area[j];
            }
            if (temp_units == 0) {
                // Degrees F
                tmaxf[j] = tmx;
                tminf[j] = tmn;
                tavgf[j] = (tmx + tmn) * 0.5;
                tmaxc[j] = f_to_c(tmx);
                tminc[j] = f_to_c(tmn);
                tavgc[j] = f_to_c(tavgf[j]);
                if (route_on == 1) {
                    tempf[j] = ts_temp;
                    tempc[j] = f_to_c(ts_temp);
                }
            } else {
                // Degrees C
                tmaxc[j] = tmx;
                tminc[j] = tmn;
                tavgc[j] = (tmx + tmn) * 0.5;
                tmaxf[j] = c_to_f(tmx);
                tminf[j] = c_to_f(tmn);
                tavgf[j] = c_to_f(tavgc[j]);
                if (route_on == 1) {
                    tempc[j] = ts_temp;
                    tempf[j] = c_to_f(ts_temp);
                }
            }
            basin_tmax += tmx * hru_area[j];
            basin_tmin += tmn * hru_area[j];
        }
        basin_tmax *= basin_area_inv;
        basin_tmin *= basin_area_inv;
        if (route_on == 1) {
            basin_temp *= basin_area_inv;
        }
        solrad_tmax = tmax[basin_tsta - 1];
        solrad_tmin = tmin[basin_tsta - 1];
        if (log.isLoggable(Level.INFO)) {
            log.info("Temp " + basin_tmax + " " + basin_tmin);
        }
    }

    static final double FIVENITH = 5.0 / 9.0;

    //***********************************************************************
    // convert fahrenheit to celsius
    //***********************************************************************
    static final double f_to_c(double temp) {
        return (temp - 32.0) * FIVENITH;
    }

    //***********************************************************************
    // convert celsius to fahrenheit
    //***********************************************************************
    static final double c_to_f(double temp) {
        return temp * FIVENITH + 32.0;
    }



    @Override
    public void clear() {
        
    }
}
