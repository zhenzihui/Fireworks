var Firework = function(startX, startY, targetX, targetY){
    this.x = startX;
    this.y = startY;
    this.startX = startX;
    this.startY = startY;
    this.hitX = false;
    this.hitY = false;
    this.coordLast = [
        {x: startX, y: startY},
        {x: startX, y: startY},
        {x: startX, y: startY}
    ];
    this.targetX = targetX;
    this.targetY = targetY;
    this.speed = self.fworkSpeed;
    this.angle = Math.atan2(targetY - startY, targetX - startX);
    this.shockwaveAngle = Math.atan2(targetY - startY, targetX - startX)+(90*(Math.PI/180));
    this.acceleration = self.fworkAccel/100;
    this.hue = self.currentHue;
    this.brightness = rand(50, 80);
    this.alpha = rand(50,100)/100;
    this.lineWidth = self.lineWidth;
    this.targetRadius = 1;
};

Firework.prototype.update = function(index){
    self.ctx.lineWidth = this.lineWidth;

    vx = Math.cos(this.angle) * this.speed,
        vy = Math.sin(this.angle) * this.speed;
    this.speed *= 1 + this.acceleration;
    this.coordLast[2].x = this.coordLast[1].x;
    this.coordLast[2].y = this.coordLast[1].y;
    this.coordLast[1].x = this.coordLast[0].x;
    this.coordLast[1].y = this.coordLast[0].y;
    this.coordLast[0].x = this.x;
    this.coordLast[0].y = this.y;

    if(self.showTarget){
        if(this.targetRadius < 8){
            this.targetRadius += .25 * self.dt;
        } else {
            this.targetRadius = 1 * self.dt;
        }
    }

    if(this.startX >= this.targetX){
        if(this.x + vx <= this.targetX){
            this.x = this.targetX;
            this.hitX = true;
        } else {
            this.x += vx * self.dt;
        }
    } else {
        if(this.x + vx >= this.targetX){
            this.x = this.targetX;
            this.hitX = true;
        } else {
            this.x += vx * self.dt;
        }
    }

    if(this.startY >= this.targetY){
        if(this.y + vy <= this.targetY){
            this.y = this.targetY;
            this.hitY = true;
        } else {
            this.y += vy * self.dt;
        }
    } else {
        if(this.y + vy >= this.targetY){
            this.y = this.targetY;
            this.hitY = true;
        } else {
            this.y += vy * self.dt;
        }
    }

    if(this.hitX && this.hitY){
        var randExplosion = rand(0, 9);
        self.createParticles(this.targetX, this.targetY, this.hue);
        self.fireworks.splice(index, 1);
    }
};

Firework.prototype.draw = function(){
    self.ctx.lineWidth = this.lineWidth;

    var coordRand = (rand(1,3)-1);
    self.ctx.beginPath();
    self.ctx.moveTo(Math.round(this.coordLast[coordRand].x), Math.round(this.coordLast[coordRand].y));
    self.ctx.lineTo(Math.round(this.x), Math.round(this.y));
    self.ctx.closePath();
    self.ctx.strokeStyle = 'hsla('+this.hue+', 100%, '+this.brightness+'%, '+this.alpha+')';
    self.ctx.stroke();

    if(self.showTarget){
        self.ctx.save();
        self.ctx.beginPath();
        self.ctx.arc(Math.round(this.targetX), Math.round(this.targetY), this.targetRadius, 0, Math.PI*2, false)
        self.ctx.closePath();
        self.ctx.lineWidth = 1;
        self.ctx.stroke();
        self.ctx.restore();
    }

    if(self.showShockwave){
        self.ctx.save();
        self.ctx.translate(Math.round(this.x), Math.round(this.y));
        self.ctx.rotate(this.shockwaveAngle);
        self.ctx.beginPath();
        self.ctx.arc(0, 0, 1*(this.speed/5), 0, Math.PI, true);
        self.ctx.strokeStyle = 'hsla('+this.hue+', 100%, '+this.brightness+'%, '+rand(25, 60)/100+')';
        self.ctx.lineWidth = this.lineWidth;
        self.ctx.stroke();
        self.ctx.restore();
    }
};