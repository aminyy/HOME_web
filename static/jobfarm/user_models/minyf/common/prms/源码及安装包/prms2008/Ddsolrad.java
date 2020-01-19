package prms2008;

import java.util.Calendar;
import java.util.logging.*;
import net.casnw.home.annotation.*;
import net.casnw.home.core.AbstractComponent;

@Component(name="Ddsolrad",
        author = "George H. Leavesley",
        createTime = "2012-0101",
        description ="Solar radiation distribution algorithm and estimation procedure for missing radiation data." +
    "Procedures for distributing solar radiation to each HRU " +
    "and for estimating missing solar radiation data using a " +
    "maximum temperature / degree-day relationship. ",
        keyword="Radiation",
        version="$Id: Ddsolrad.java 1738 2011-02-10 22:23:17Z ghleavesley $",
        source="$URL: http://svn.javaforge.com/svn/oms/branches/oms3.prj.prms2008/src/prms2008/Ddsolrad.java $"
        )
    
public class Ddsolrad  extends AbstractComponent{

    private static final Logger log = Logger.getLogger("oms3.model." + Ddsolrad.class.getSimpleName());

    ///////////////////////////////////////////////////////////// private fields
    private static double SOLF[] = {
        .20,.35,.45,.51,.56,.59,.62,.64,.655,.67,
        .682,.69,.70,.71,.715,.72,.722,.724,.726,.728,
        .73,.734,.738,.742,.746,.75
    };
    private static double NEARZERO = 1.0e-10;
    
    private double plrad[];

    ////////////////////////////////////////////////////////////// Input params
    @Parameter(description ="Number of HRUs.")
    public int nhru;

    @Parameter(description ="Number of radiation planes.")
    public int nradpl;
   
    @Parameter(description ="Number of solar radiation stations.")
    public int nsol;
    
    @Parameter(description ="Intercept in temperature / degree-day relationship. Intercept in relationship: dd-coef =  dday_intcp + dday_slope*(tmax)+1.",
      unit="dday",dimension="nmonths")
    public double[] dday_intcp;

    @Parameter(description ="Slope in temperature / degree-day relationship. Coefficient in relationship: dd-coef =  dday_intcp + dday_slope*(tmax)+1.",
            unit="dday/degree",dimension="nmonths")
    public double[] dday_slope;

    @Parameter(description ="Index of the radiation plane used to compute solar radiation for a given HRU",
            dimension="nhru")
    public int[] hru_radpl;

    @Parameter(description ="If basin precipitation exceeds this value, solar radiation is mutiplied by the summer or winter precip adjustment factor, depending on the season. ",
            unit="inches",dimension="nmonths")
    public double[] ppt_rad_adj;

    @Parameter(description ="Intercept in the temperature-range adjustment equation for solar radiation. Intercept in equation:  adj = radadj_intcp + radadj_slope*(tmax-tmax_index)",
            unit="dday")
     public double radadj_intcp;

    @Parameter(description ="Slope in the temperature-range adjustment equation for solar radiation. Slope in equation: adj = radadj_intcp + radadj_slope *  (tmax - tmax_index)",
            unit="dday/degree")
     public double radadj_slope;

    @Parameter(description ="Adjustment factor for computed solar radiation for summer day with greater than ppt_rad_adj inches precip",
            unit="decimal fraction")
     public double radj_sppt;

    @Parameter(description ="Adjustment factor for computed solar radiation for winter day with greater than ppt_rad_adj inches precip",
            unit="decimal fraction")
     public double radj_wppt;

    @Parameter(description ="Index of solar radiation station associated with each HRU",
            dimension="nhru")
     public int[] hru_solsta;

    @Parameter(description ="The maximum portion of the potential solar radiation that may reach the ground due to haze, dust, smog, etc.",
            unit="decimal fraction")
     public double radmax;

    @Parameter(description ="If maximum temperature of an HRU is greater than or equal to this value (for each month, January to December),  precipitation is assumed to be rain",
            unit="degrees",dimension="nmonths")
     public double[] tmax_allrain;

    @Parameter(description ="Index temperature, by month, used to determine precipitation adjustments to solar radiation, in deg F or C depending  on units of data",
            unit="degrees",dimension="nmonths")
     public double[] tmax_index;

    @Parameter(description ="Index of the solar radiation station used to compute basin radiation values")
      public int basin_solsta;
    
    @Parameter(description ="Conversion factor to convert measured radiation to langleys")
     public double rad_conv;
    
    @Parameter(description ="Area of each HRU",unit="acres",dimension="nhru")
     public double[] hru_area;

    // Input vars /////////////////////////
    @Variable(access =AccessType.IN,description="Cosine of the radiation plane slope [soltab]",
            dimension="nradpl")
     public double[] radpl_cossl;

    @Variable(access =AccessType.IN,description="Potential shortwave radiation for each radiation plane for each timestep [soltab]",
            unit="langleys",dimension="366,nradpl")
     public double[][] radpl_soltab;

    @Variable(access =AccessType.IN,description="Area-weighted measured average precipitation for basin. [precip]",unit="inches")
    public double basin_obs_ppt;

    @Variable(access =AccessType.IN,description="Observed solar radiation [obs]",unit="langleys",dimension="nsol")
     public double[] solrad;

    @Variable(access =AccessType.IN,description="Basin daily maximum temperature adjusted to elevation of solar radiation station",
            unit="degrees F")
    public double solrad_tmax;

    @Variable(access =AccessType.IN,description="Switch signifying the start of a new day (0=no; 1=yes)")
    public int newday;

    @Variable(access =AccessType.IN,description="Number of active HRUs")
     public int active_hrus;

    @Variable(access =AccessType.IN,description="Routing order for HRUs",dimension="nhru")
     public int[] hru_route_order;

    @Variable(access =AccessType.IN,description="Inverse of total basin area, expressed as the sum of HRU areas",
            unit="1/acres")
     public double basin_area_inv;

    @Variable(access =AccessType.IN,description="Flag to indicate in which hemisphere the basin resides  (0=Northern; 1=Southern)")
    public int hemisphere;

    @Variable(access =AccessType.IN,description="Date of the current time step",unit="yyyy mm dd hh mm ss")
    public Calendar date;


    // Output vars ///////////////////////////////////////////////////////////
     @Variable(access =AccessType.OUT,description="Computed shortwave radiation for each HRU",
             unit="langleys",dimension="nhru")
     public double[] swrad;

    @Variable(access =AccessType.OUT,description="Area-weighted average of potential shortwave radiation for the basin",
            unit="langleys")
     public double basin_potsw;
    
    @Variable(access =AccessType.OUT,description="Measured or computed solar radiation on a horizontal surface",
            unit="langleys")
     public double orad;

    @Variable(access =AccessType.OUT,description="Potential shortwave radiation for the basin centroid",unit="langleys")
     public double basin_horad;
   
    public void init() {
        swrad = new double[nhru];
        plrad = new double[nradpl];
    }

    @Override
    public void run() {
        if (swrad == null) {
            init();
        }

        if (newday == 0) {
            return;
        }

        int mo = date.get(java.util.Calendar.MONTH);
        int jday = date.get(Calendar.DAY_OF_YEAR);

        double pptadj;
        double radadj = 0.0;
        basin_horad = radpl_soltab[jday - 1][0];
        orad = -999.0;

        if (nsol > 0) {
            if (basin_solsta > 0) {
                orad = solrad[basin_solsta - 1] * rad_conv;
            }
        }

        if (orad < NEARZERO || orad > 10000.) {
            double dday = (dday_slope[mo] * solrad_tmax) + dday_intcp[mo] + 1.0;
            if (dday < 1.0) {
                dday = 1.0;
            }
            if (basin_obs_ppt <= ppt_rad_adj[mo]) {
                pptadj = 1.0;
            } else if (solrad_tmax >= tmax_index[mo]) {
                double tdif = solrad_tmax - tmax_index[mo];
                pptadj = radadj_intcp + radadj_slope * tdif;
                if (pptadj > 1.) {
                    pptadj = 1.;
                }
            } else {
                pptadj = radj_wppt;
                if (solrad_tmax >= tmax_allrain[mo]) {
                    if (hemisphere == 0) { // northern hemisphere
                        if (jday < 79 || jday > 265) { // equinox
                            pptadj = radj_wppt;
                        } else {
                            pptadj = radj_sppt;
                        }
                    } else {  // southern hemisphere
                        if (jday > 79 || jday < 265) {  // equinox
                            pptadj = radj_wppt;
                        } else {
                            pptadj = radj_sppt;
                        }
                    }
                }
            }

            if (dday < 26.) {
                int kp = (int) dday;
                double ddayi = kp;
                int kp1 = kp + 1;
                radadj = SOLF[kp - 1] + ((SOLF[kp1 - 1] - SOLF[kp - 1]) * (dday - ddayi));
            } else {
                radadj = radmax;
            }
            // System.out.println(jday + " radadj " + radadj + " pptadj " + pptadj +
//                        " soltmx " + solrad_tmax + " obsppt " + basin_obs_ppt);
            radadj = radadj * pptadj;
            if (radadj < .2) {
                radadj = .2;
            }
            orad = radadj * basin_horad;
        }
        // System.out.println("lday  " + lday + " orad  " + orad + " radadj " + radadj
        //           + " horad " + basin_horad);

        for (int j = 0; j < nradpl; j++) {
            plrad[j] = (radpl_soltab[jday - 1][j] / basin_horad) * (orad / radpl_cossl[j]);
            // System.out.println("lday" + lday +  "rsoltab " + radpl_soltab.getValue(jday-1,j) + " plrad " +
            //           plrad[j] + " rcosl " + radpl_cossl[j]);
        }
        // System.out.println("hrus " + active_hrus);

        basin_potsw = 0.0;
        if (nsol == 0) {
            for (int jj = 0; jj < active_hrus; jj++) {
                int j = hru_route_order[jj];
                int ir = hru_radpl[j] - 1;
                swrad[j] = plrad[ir];
                basin_potsw += swrad[j] * hru_area[j];
            }
        } else {
            for (int jj = 0; jj < active_hrus; jj++) {
                int j = hru_route_order[jj];
                int k = hru_solsta[j] - 1;
                if (k == 0 || k > nsol - 1) {
                    int ir = hru_radpl[j] - 1;
                    swrad[j] = plrad[ir];
                } else {
                    swrad[j] = solrad[k] * rad_conv;
                }
                basin_potsw += swrad[j] * hru_area[j];
            }
        }
        basin_potsw *= basin_area_inv;
        if (log.isLoggable(Level.INFO)) {
            log.info("Solrad " + basin_potsw);
        }
    }



    @Override
    public void clear() {
       
    }
}
