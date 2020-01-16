namespace twActivitiest.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ADDFOOD_BOOL : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Foods", "Isdelete", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Foods", "Isdelete");
        }
    }
}
