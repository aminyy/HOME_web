package prms2008;

import java.util.Calendar;
import java.util.logging.*;
import net.casnw.home.annotation.AccessType;
import net.casnw.home.annotation.Component;
import net.casnw.home.annotation.Parameter;
import net.casnw.home.annotation.Variable;
import net.casnw.home.core.AbstractComponent;

@Component(name = "precip",
author = "George H. Leavesley",
createTime = "2012-0101",
description = "Precipitation form and distribution."
+ "This component determines whether measured precipitation"
+ "is rain or snow and distributes it to the HRU's.",
keyword = "Precipitation")
public class Precip extends AbstractComponent{

    private static final Logger log = Logger.getLogger("oms3.model." + Precip.class.getSimpleName());
    // private fields
    public double[] tmax;
    public double[] tmin;
    public int[] istack;
    // Input Parameter
    @Parameter(description = "Number of temperature stations.")
    public int ntemp;
    @Parameter(description = "Number of precipitation stations.")
    public int nrain;
    @Parameter(description = "NNumber of HRUs.")
    public int nhru;
    @Parameter(description = "NNumber of storms.")
    public int nstorm;
    @Parameter(description = "Adjustment factor for rain in a rain/snow mix "
    + "Monthly factor to adjust rain proportion in a mixed  rain/snow event",
    unit = "decimal fraction")
    public double[] adjmix_rain;
    @Parameter(description = "Units for measured precipitation Units for measured precipitation (0=inches; 1=mm)")
    public int precip_units;
    @Parameter(description = "Area of each HRU ",
    unit = "acres")
    public double[] hru_area;
    @Parameter(description = "Monthly factor to adjust measured precipitation on "
    + "each HRU to account for differences in elevation, etc ",
    unit = "decimal fraction")
    public double[][] rain_adj;
    @Parameter(description = "Monthly factor to adjust measured precipitation on "
    + "each HRU to account for differences in elevation, etc ",
    unit = "decimal fraction")
    public double[][] snow_adj;
    @Parameter(description = "Monthly factor to adjust measured precipitation to "
    + " each HRU to account for differences in elevation,  etc. "
    + "This factor is for the rain gage used for kinematic or storm routing ",
    unit = "decimal fraction")
    public double[][] strain_adj;
    @Parameter(description = "Units for measured temperature (0=Fahrenheit; 1=Celsius)")
    public int temp_units;
    @Parameter(description = "Index of the base precipitation station used for lapse rate calculations for each HRU. ",
    dimension = "nhru")
    public int[] hru_psta;
    @Parameter(description = "If maximum temperature of an HRU is greater than or equal to this "
    + "value (for each month, January to December),  precipitation is assumed to be rain,"
    + "  in deg C or F, depending on units of data ",
    unit = "degrees",
    dimension = "nmonths")
    public double[] tmax_allrain;
    @Parameter(description = "If HRU maximum temperature is less than or equal to this  value, "
    + "precipitation is assumed to be snow,  in deg C or F, depending on units of data ",
    unit = "degrees")
    public double tmax_allsnow;
    @Parameter(description = "Adjustment factor for each storm ",
    unit = "percent",
    dimension = "nstorm")
    public double[] storm_scale_factor;
    // Input vars
    @Variable(access = AccessType.IN,
    description = "Inverse of total basin area as sum of HRU areas",
    unit = "1/acres")
    public double basin_area_inv;
    @Variable(access = AccessType.IN,
    description = "Observed precipitation at each measurement station. [obs]",
    unit = "inches",
    dimension = "nhru")
    public double[] precip;
    @Variable(access = AccessType.IN,
    description = "HRU adjusted temperature for timestep < 24",
    unit = "deg C",
    dimension = "nhru")
    public double[] tempc;
    @Variable(access = AccessType.IN,
    description = "HRU adjusted temperature for timestep < 24",
    unit = "deg F",
    dimension = "nhru")
    public double[] tempf;
    @Variable(access = AccessType.IN,
    description = "Kinematic routing switch (0=daily; 1=storm period)")
    public int route_on;
    @Variable(access = AccessType.IN,
    description = "Maximum HRU temperature. [temp]",
    unit = "deg C",
    dimension = "nhru")
    public double[] tmaxc;
    @Variable(access = AccessType.IN,
    description = "Maximum HRU temperature. [temp]",
    unit = "deg F",
    dimension = "nhru")
    public double[] tmaxf;
    @Variable(access = AccessType.IN,
    description = "Minimum HRU temperature. [temp]",
    unit = "deg C",
    dimension = "nhru")
    public double[] tminc;
    @Variable(access = AccessType.IN,
    description = "Minimum HRU temperature. [temp]",
    unit = "deg F",
    dimension = "nhru")
    public double[] tminf;
    @Variable(access = AccessType.IN,
    description = "Basin daily maximum temperature for use with solrad radiation component")
    public double solrad_tmax;
    @Variable(access = AccessType.IN,
    description = "Number of active HRUs")
    public int active_hrus;
    @Variable(access = AccessType.IN,
    description = "Routing order for HRUs",
    dimension = "nhru")
    public int[] hru_route_order;
    @Variable(access = AccessType.IN,
    description = "Date of the current time step",
    unit = "yyyy mm dd hh mm ss")
    public Calendar date;
    // Output Vars
    @Variable(access = AccessType.OUT,
    description = "Adjusted precipitation on each HRU",
    unit = "inches",
    dimension = "nhru")
    public double[] hru_ppt;
    @Variable(access = AccessType.OUT,
    description = "Computed rain on each HRU",
    unit = "inches",
    dimension = "nhru")
    public double[] hru_rain;
    @Variable(access = AccessType.OUT,
    description = "Computed snow on each HRU",
    unit = "inches",
    dimension = "nhru")
    public double[] hru_snow;
    @Variable(access = AccessType.OUT,
    description = "New snow on HRU (0=no; 1=yes)",
    dimension = "nhru")
    public int[] newsnow;
    @Variable(access = AccessType.OUT,
    description = "Precipitation mixture (0=no; 1=yes)",
    dimension = "nhru")
    public int[] pptmix;
    @Variable(access = AccessType.OUT,
    description = "Proportion of rain in a mixed event",
    unit = "decimal fraction",
    dimension = "nhru")
    public double[] prmx;
    @Variable(access = AccessType.OUT,
    description = "Area weighted adjusted average rain for basin",
    unit = "inches")
    public double basin_rain;
    @Variable(access = AccessType.OUT,
    description = "Area weighted adjusted average snow for basin",
    unit = "inches")
    public double basin_snow;
    @Variable(access = AccessType.OUT,
    description = "Area weighted adjusted average precip for basin",
    unit = "inches")
    public double basin_obs_ppt;
    @Variable(access = AccessType.OUT,
    description = "Area weighted adjusted average precip for basin",
    unit = "inches")
    public double basin_ppt;

    @Override
    public void init() {
        hru_ppt = new double[nhru];
        hru_rain = new double[nhru];
        hru_snow = new double[nhru];
        newsnow = new int[nhru];
        pptmix = new int[nhru];
        prmx = new double[nhru];

        tmax = new double[nhru];
        tmin = new double[nhru];
        istack = new int[nrain];

        for (int i = 0; i < nhru; i++) {
            if (hru_psta[i] < 1) {      //TODO maybe this should throw an exception instead
                hru_psta[i] = 1;
            }
        }
        if (nstorm > 0) {
            for (int i = 0; i < nstorm; i++) {
                storm_scale_factor[i] = (100.0 + storm_scale_factor[i]) / 100.0;
            }
            for (int ii = 0; ii < active_hrus; ii++) {
                int i = hru_route_order[ii];
                for (int k = 0; k < 12; k++) {
                    strain_adj[k][i] *= storm_scale_factor[0];
                }
            }
        }
    }


    @Override
    public void run() {
        if (hru_ppt == null) {
            init();
        }

        int iform = 0;

        if (precip_units == 1) {
            for (int i = 0; i < nrain; i++) {
                precip[i] /= 25.4;  // inch -> mm
            }
        }
//        if (nform > 0) {
//            iform = form_data[0];
//        } else {
//            iform = 0;
//        }

        int year = date.get(Calendar.YEAR);
        int mo = date.get(Calendar.MONTH);
        int day = date.get(Calendar.DAY_OF_MONTH);

        if (solrad_tmax < -50.00) {
            System.out.println("bad temperature data, using previous time "
                    + "step values" + solrad_tmax + " " + mo);
            // load tmax and tmin with appropriate observed values
        } else if (temp_units == 0) {
            if (route_on == 1) {
                // rsr, warning, tempf needs to be set in temperature module
                for (int j = 0; j < nhru; j++) {
                    tmax[j] = tempf[j];
                    tmin[j] = tmax[j];
                }
            } else {
                for (int j = 0; j < nhru; j++) {
                    tmax[j] = tmaxf[j];
                    tmin[j] = tminf[j];
                }
            }
        } else if (route_on == 1) {
            // rsr, warning, tempc needs to be set in temperature module
            for (int j = 0; j < nhru; j++) {
                tmax[j] = tempc[j];
                tmin[j] = tmax[j];
            }
        } else {
            for (int j = 0; j < nhru; j++) {
                tmax[j] = tmaxc[j];
                tmin[j] = tminc[j];
            }
        }

        basin_ppt = 0.;
        basin_rain = 0.;
        basin_snow = 0.;

        for (int i = 0; i < nrain; i++) {
            istack[i] = 0;
        }

        double sum_obs = 0.0;

        for (int ii = 0; ii < active_hrus; ii++) {
            int i = hru_route_order[ii];
            pptmix[i] = 0;
            hru_ppt[i] = 0.0;
            hru_rain[i] = 0.0;
            hru_snow[i] = 0.0;
            newsnow[i] = 0;
            prmx[i] = 0.0;
            int ip = hru_psta[i] - 1;
            double ppt = precip[ip];
            if (ppt < 0.0) {
                if (istack[ip] == 0) {
                    System.out.println("warning, bad precipitation value: " + ppt
                            + "; precip station: " + ip + "; time: " + year + " " + mo + 1 + " "
                            + day + " ; value set to 0.0");
                    istack[ip] = 1;
                }
                ppt = 0.0;
            }

            if (ppt < 1.0e-06) {
                continue;
            }

            sum_obs += (ppt * hru_area[i]);

//******if within storm period for kinematic routing, adjust precip
//******by storm adjustment factor
            if (route_on == 1) {
                double pcor = strain_adj[mo][i];
                hru_ppt[i] = ppt * pcor;
                hru_rain[i] = hru_ppt[i];
                prmx[i] = 1.0;
            } //******if observed temperature data are not available or if observed
            //******form data are available and rain is explicitly specified then
            //******precipitation is all rain.
            else if (solrad_tmax < -50.0 || solrad_tmax > 150.0 || iform == 2) {
                if ((solrad_tmax > -998 && solrad_tmax < -50.0) || solrad_tmax > 150.0) {
                    System.out.println("warning, bad solrad_tmax " + solrad_tmax + " " + year + " " + mo + 1 + " " + day);
                }
                double pcor = rain_adj[mo][i];
                hru_ppt[i] = ppt * pcor;
                hru_rain[i] = hru_ppt[i];
                prmx[i] = 1.0;
            } //******if form data are available and snow is explicitly specified or if
            //******maximum temperature is below or equal to the base temperature for
            //******snow then precipitation is all snow
            else if (iform == 1 || tmax[i] <= tmax_allsnow) {
                double pcor = snow_adj[mo][i];
                hru_ppt[i] = ppt * pcor;
                hru_snow[i] = hru_ppt[i];
                newsnow[i] = 1;
            } //******if minimum temperature is above base temperature for snow or
            //******maximum temperature is above all_rain temperature then
            //******precipitation is all rain
            else if (tmin[i] > tmax_allsnow || tmax[i] >= tmax_allrain[mo]) {

                double pcor = rain_adj[mo][i];
                hru_ppt[i] = ppt * pcor;
                hru_rain[i] = hru_ppt[i];
                prmx[i] = 1.0;
            } //******otherwise precipitation is a mixture of rain and snow
            else {
                prmx[i] = (((tmax[i] - tmax_allsnow) / (tmax[i] - tmin[i])) * adjmix_rain[mo]);

//******unless mixture adjustment raises the proportion of rain to
//******greater than or equal to 1.0 in which case it all rain
                if (prmx[i] >= 1.0) {  //rsr changed > to ge 1/8/2006
                    double pcor = rain_adj[mo][i];
                    hru_ppt[i] = ppt * pcor;
                    hru_rain[i] = hru_ppt[i];
                    prmx[i] = 1.0;
                } //******if not, it is a rain/snow mixture
                else {
                    double pcor = snow_adj[mo][i];
                    pptmix[i] = 1;
                    hru_ppt[i] = ppt * pcor;
                    hru_rain[i] = prmx[i] * hru_ppt[i];
                    hru_snow[i] = hru_ppt[i] - hru_rain[i];
                    newsnow[i] = 1;
                }
            }
//            System.out.println("mo, day, hru, pcor, hruppt " + mo + " " + day + " " + i + " " + pcor + " " + hru_ppt[i]);
            basin_ppt += hru_ppt[i] * hru_area[i];
            basin_rain += hru_rain[i] * hru_area[i];
            basin_snow += hru_snow[i] * hru_area[i];
        }  // end hru loop

        basin_obs_ppt = sum_obs * basin_area_inv;
        basin_ppt *= basin_area_inv;
        basin_rain *= basin_area_inv;
        basin_snow *= basin_area_inv;

        if (log.isLoggable(Level.INFO)) {
            log.info("Precip " + basin_rain + " " + basin_ppt + " " + basin_snow);
        }
    }

 
    @Override
    public void clear() {
       
    }
}
